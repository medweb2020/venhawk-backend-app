import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createConnection, RowDataPacket } from 'mysql2/promise';

type VendorRow = RowDataPacket & {
  id: number;
  brand_name: string;
  logo_url: string | null;
};

type ClientRow = RowDataPacket & {
  id: number;
  vendor_id: number;
  vendor_brand_name: string;
  client_name: string;
  client_logo_url: string | null;
};

type ManifestEntry = {
  kind: 'vendor' | 'client';
  fileName: string;
  matchedName: string;
  recordId: number;
  vendorId?: number;
  uploadedUrl: string;
};

const ROOT_DIR = path.resolve(__dirname, '../..');
const TMP_DIR = path.join(ROOT_DIR, 'tmp');
const CLIENT_LOGO_DIR = path.join(TMP_DIR, 'new-client-logos');
const VENDOR_LOGO_DIR = path.join(TMP_DIR, 'new-vendor-logos');
const MANIFEST_DIR = path.join(TMP_DIR, 'logo-sync-local');
const MANIFEST_PATH = path.join(MANIFEST_DIR, 'manifest.json');

const VENDOR_FILE_ALIASES: Record<string, string> = {
  cloudforce: 'CloudForce',
  deloitte: 'Deloitte',
  element: 'Element Technologies',
  esentio: 'eSentio Technologies',
  heliont: 'Helient Systems',
  rbro: 'RBRO',
  'thomson reutors': 'Thomson Reuters',
  'wise consulting': 'Wise Consulting',
  zendisk: 'Zendesk Pro Services',
};

const CLIENT_FILE_ALIASES: Record<string, string> = {
  'spotify logo': 'Spotify',
  'minna bank': 'Minna Bank',
  'international flavors fragrances': 'International Flavors & Fragrances (IFF)',
};

const normalize = (value: string) =>
  String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toSlug = (value: string) =>
  normalize(value)
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');

const getMimeType = (extension: string) => {
  switch (extension.toLowerCase()) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.svg':
      return 'image/svg+xml';
    case '.webp':
      return 'image/webp';
    case '.ico':
      return 'image/x-icon';
    default:
      return 'application/octet-stream';
  }
};

const parseEnvValue = (value: string) => {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
};

const loadLocalEnv = async () => {
  const envPath = path.join(ROOT_DIR, '.env');
  try {
    const envContent = await fs.readFile(envPath, 'utf8');
    for (const rawLine of envContent.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) {
        continue;
      }

      const separatorIndex = line.indexOf('=');
      if (separatorIndex === -1) {
        continue;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = parseEnvValue(line.slice(separatorIndex + 1));

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    throw new Error(`Unable to load .env from ${envPath}: ${(error as Error).message}`);
  }
};

const ensureRequiredEnv = () => {
  const requiredKeys = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE', 'SUPABASE_URL'];
  for (const key of requiredKeys) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY');
  }

  if (!process.env.SUPABASE_LOGO_BUCKET_NAME && !process.env.SUPABASE_BUCKET_NAME) {
    throw new Error('Missing SUPABASE_LOGO_BUCKET_NAME or SUPABASE_BUCKET_NAME');
  }
};

const resolveExactOrAlias = <T extends { brand_name?: string; client_name?: string }>(
  candidates: T[],
  fileBaseName: string,
  aliasMap: Record<string, string>,
  field: 'brand_name' | 'client_name',
) => {
  const normalizedFileBase = normalize(fileBaseName);
  const aliasedName = aliasMap[normalizedFileBase];
  const exactName = aliasedName ? normalize(aliasedName) : normalizedFileBase;

  let matches = candidates.filter((item) => normalize(String(item[field] || '')) === exactName);

  if (matches.length === 1) {
    return matches[0];
  }

  matches = candidates.filter((item) => {
    const normalizedCandidate = normalize(String(item[field] || ''));
    return (
      normalizedCandidate.includes(normalizedFileBase) ||
      normalizedFileBase.includes(normalizedCandidate)
    );
  });

  if (matches.length === 1) {
    return matches[0];
  }

  return null;
};

const uploadFile = async (
  supabaseUrl: string,
  supabaseKey: string,
  bucketName: string,
  filePath: string,
  objectPath: string,
) => {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const fileBuffer = await fs.readFile(filePath);
  const extension = path.extname(filePath);
  const contentType = getMimeType(extension);

  const { error } = await supabase.storage.from(bucketName).upload(objectPath, fileBuffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw new Error(`Supabase upload failed for ${objectPath}: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(objectPath);

  return publicUrl;
};

const main = async () => {
  await loadLocalEnv();
  ensureRequiredEnv();

  const db = await createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  const supabaseUrl = process.env.SUPABASE_URL as string;
  const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY) as string;
  const bucketName = (process.env.SUPABASE_LOGO_BUCKET_NAME ||
    process.env.SUPABASE_BUCKET_NAME) as string;

  console.log(`Using Supabase bucket: ${bucketName}`);

  const [vendors] = await db.query<VendorRow[]>(
    'SELECT id, brand_name, logo_url FROM vendors ORDER BY brand_name',
  );
  const [clients] = await db.query<ClientRow[]>(
    `SELECT vc.id, vc.vendor_id, v.brand_name AS vendor_brand_name, vc.client_name, vc.client_logo_url
     FROM vendor_clients vc
     INNER JOIN vendors v ON v.id = vc.vendor_id
     ORDER BY v.brand_name, vc.client_name`,
  );

  const vendorFiles = (await fs.readdir(VENDOR_LOGO_DIR))
    .filter((fileName) => !fileName.startsWith('.'))
    .sort((left, right) => left.localeCompare(right));
  const clientFiles = (await fs.readdir(CLIENT_LOGO_DIR))
    .filter((fileName) => !fileName.startsWith('.'))
    .sort((left, right) => left.localeCompare(right));

  const manifest: ManifestEntry[] = [];
  const unmatchedVendors: string[] = [];
  const unmatchedClients: string[] = [];

  for (const fileName of vendorFiles) {
    const fullPath = path.join(VENDOR_LOGO_DIR, fileName);
    const fileBaseName = path.parse(fileName).name;
    const matchedVendor = resolveExactOrAlias(vendors, fileBaseName, VENDOR_FILE_ALIASES, 'brand_name');

    if (!matchedVendor) {
      unmatchedVendors.push(fileName);
      continue;
    }

    const extension = path.extname(fileName).toLowerCase();
    const objectPath = `logos/vendors/${matchedVendor.id}-${toSlug(matchedVendor.brand_name)}${extension}`;
    const publicUrl = await uploadFile(supabaseUrl, supabaseKey, bucketName, fullPath, objectPath);

    await db.execute('UPDATE vendors SET logo_url = ? WHERE id = ?', [publicUrl, matchedVendor.id]);

    manifest.push({
      kind: 'vendor',
      fileName,
      matchedName: matchedVendor.brand_name,
      recordId: matchedVendor.id,
      uploadedUrl: publicUrl,
    });

    console.log(`Updated vendor logo: ${matchedVendor.brand_name} -> ${publicUrl}`);
  }

  for (const fileName of clientFiles) {
    const fullPath = path.join(CLIENT_LOGO_DIR, fileName);
    const fileBaseName = path.parse(fileName).name;
    const matchedClient = resolveExactOrAlias(clients, fileBaseName, CLIENT_FILE_ALIASES, 'client_name');

    if (!matchedClient) {
      unmatchedClients.push(fileName);
      continue;
    }

    const extension = path.extname(fileName).toLowerCase();
    const objectPath = `logos/clients/${matchedClient.vendor_id}/${matchedClient.id}-${toSlug(
      matchedClient.client_name,
    )}${extension}`;
    const publicUrl = await uploadFile(supabaseUrl, supabaseKey, bucketName, fullPath, objectPath);

    await db.execute('UPDATE vendor_clients SET client_logo_url = ? WHERE id = ?', [publicUrl, matchedClient.id]);

    manifest.push({
      kind: 'client',
      fileName,
      matchedName: matchedClient.client_name,
      recordId: matchedClient.id,
      vendorId: matchedClient.vendor_id,
      uploadedUrl: publicUrl,
    });

    console.log(
      `Updated client logo: ${matchedClient.vendor_brand_name} / ${matchedClient.client_name} -> ${publicUrl}`,
    );
  }

  await fs.mkdir(MANIFEST_DIR, { recursive: true });
  await fs.writeFile(
    MANIFEST_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        vendorFilesProcessed: vendorFiles.length,
        clientFilesProcessed: clientFiles.length,
        uploaded: manifest,
        unmatchedVendors,
        unmatchedClients,
      },
      null,
      2,
    ),
    'utf8',
  );

  console.log('');
  console.log('Local logo sync summary');
  console.log(`- Vendors processed: ${vendorFiles.length}`);
  console.log(`- Clients processed: ${clientFiles.length}`);
  console.log(`- Uploaded: ${manifest.length}`);
  console.log(`- Unmatched vendors: ${unmatchedVendors.length}`);
  console.log(`- Unmatched clients: ${unmatchedClients.length}`);
  console.log(`- Manifest: ${MANIFEST_PATH}`);

  if (unmatchedVendors.length > 0) {
    console.log(`- Vendor files not matched: ${unmatchedVendors.join(', ')}`);
  }

  if (unmatchedClients.length > 0) {
    console.log(`- Client files not matched: ${unmatchedClients.join(', ')}`);
  }

  await db.end();
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

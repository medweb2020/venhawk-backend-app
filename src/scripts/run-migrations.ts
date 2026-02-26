import { createAppDataSource } from '../database/typeorm-migrations.data-source';
import { loadLocalEnvIfPresent } from '../config/load-local-env';

const MIGRATION_LOCK = 'venhawk_typeorm_migrations_lock';

function validateDbEnvironment(): void {
  const required = [
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
  ];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required DB env vars: ${missing.join(', ')}`);
  }
}

async function run(): Promise<void> {
  loadLocalEnvIfPresent();
  validateDbEnvironment();

  const dataSource = createAppDataSource();
  await dataSource.initialize();

  try {
    const lockRows = (await dataSource.query(
      'SELECT GET_LOCK(?, 120) AS ok',
      [MIGRATION_LOCK],
    )) as Array<{ ok: number }>;

    if (!lockRows[0] || Number(lockRows[0].ok) !== 1) {
      throw new Error('Could not acquire migration lock within timeout');
    }

    try {
      const migrations = await dataSource.runMigrations({ transaction: 'each' });
      if (migrations.length === 0) {
        console.log('No pending migrations');
      } else {
        console.log(`Applied ${migrations.length} migration(s):`);
        for (const migration of migrations) {
          console.log(`- ${migration.name}`);
        }
      }
    } finally {
      await dataSource.query('DO RELEASE_LOCK(?)', [MIGRATION_LOCK]);
    }
  } finally {
    await dataSource.destroy();
  }
}

run().catch((error: Error) => {
  console.error('Migration runner failed:', error.message);
  process.exit(1);
});

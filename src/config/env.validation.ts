export function validateEnvironment() {
  const requiredEnvVars = [
    'AUTH0_DOMAIN',
    'AUTH0_AUDIENCE',
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_BUCKET_NAME',
  ];

  const missingVars: string[] = [];

  console.log('🔍 Validating environment variables...');
  requiredEnvVars.forEach((varName) => {
    const value = process.env[varName];
    if (!value) {
      missingVars.push(varName);
      console.error(`❌ Missing: ${varName}`);
    } else {
      const shouldMask = varName.includes('PASSWORD') || varName.includes('KEY');
      console.log(`✅ Found: ${varName} = ${shouldMask ? '***' : value}`);
    }
  });

  if (missingVars.length > 0) {
    console.error('⚠️  WARNING: Missing required environment variables:', missingVars.join(', '));
    console.error('⚠️  App may not work correctly!');
    // Don't throw error in production to see other logs
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}. ` +
          `Please set them in Railway's environment variables.`,
      );
    }
  } else {
    console.log('✅ All required environment variables are set!');
  }
}

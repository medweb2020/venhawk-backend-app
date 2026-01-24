export function validateEnvironment() {
  const requiredEnvVars = [
    'AUTH0_DOMAIN',
    'AUTH0_AUDIENCE',
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
  ];

  const missingVars: string[] = [];

  console.log('🔍 Validating environment variables...');
  requiredEnvVars.forEach((varName) => {
    const value = process.env[varName];
    if (!value) {
      missingVars.push(varName);
      console.error(`❌ Missing: ${varName}`);
    } else {
      console.log(`✅ Found: ${varName} = ${varName.includes('PASSWORD') ? '***' : value}`);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
        `Please set them in Railway's environment variables.`,
    );
  }

  console.log('✅ All required environment variables are set!');
}

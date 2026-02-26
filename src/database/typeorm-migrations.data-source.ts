import { DataSource, DataSourceOptions } from 'typeorm';
import {
  TYPEORM_ENTITIES,
  TYPEORM_MIGRATIONS,
  TYPEORM_MIGRATIONS_TABLE_NAME,
} from './typeorm.constants';
import { loadLocalEnvIfPresent } from '../config/load-local-env';

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getTypeOrmDataSourceOptions(): DataSourceOptions {
  return {
    type: 'mysql',
    host: getRequiredEnv('DB_HOST'),
    port: Number(getRequiredEnv('DB_PORT')),
    username: getRequiredEnv('DB_USERNAME'),
    password: getRequiredEnv('DB_PASSWORD'),
    database: getRequiredEnv('DB_DATABASE'),
    entities: TYPEORM_ENTITIES,
    migrations: TYPEORM_MIGRATIONS,
    migrationsTableName: TYPEORM_MIGRATIONS_TABLE_NAME,
    synchronize: false,
  };
}

export function createAppDataSource(): DataSource {
  return new DataSource(getTypeOrmDataSourceOptions());
}

loadLocalEnvIfPresent();
const appDataSource = createAppDataSource();

export default appDataSource;

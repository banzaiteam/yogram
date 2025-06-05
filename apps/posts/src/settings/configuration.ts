import path from 'path';
import { cwd } from 'process';

export type EnvironmentsTypes =
  | 'DEVELOPMENT'
  | 'STAGING'
  | 'PRODUCTION'
  | 'TESTING';
export const EnvironmentMode = {
  DEVELOPMENT: 'DEVELOPMENT',
  STAGING: 'STAGING',
  PRODUCTION: 'PRODUCTION',
  TESTING: 'TESTING',
};
export const Environments = Object.keys(EnvironmentMode);
console.log(
  'dirname',
  path.join(cwd(), '/apps/users/src/**/*.entity{.ts,.js}'),
);

export const getConfiguration = () => {
  console.log(process.env.NODE_ENV?.trim(), 'NODE_ENV');
  console.log(process.env.PORT, 'process.env.PORT');
  return {
    NODE_ENV: (Environments.includes(process.env.NODE_ENV?.trim())
      ? process.env.NODE_ENV.trim()
      : 'DEVELOPMENT') as EnvironmentsTypes,
    PORT: process.env.PORT || process.env.POSTS_PORT,
    POSTS_PORT: process.env.POSTS_PORT,
    url: process.env.POSTGRES_URL,
    type: process.env.POSTGRES_TYPE,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    migrationsTableName: process.env.POSTGRES_MIGRATION_TABLE,
    migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
    autoLoadEntities: process.env.AUTOLOAD_ENTITIES,
    synchronize: process.env.SYNCHRONIZE === 'true',
    dropSchema: process.env.DROP_SCHEMA === 'true',
    RMQ_URL: process.env.RMQ_URL,
  };
};

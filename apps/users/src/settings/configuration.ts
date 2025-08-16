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

export const getConfiguration = () => {
  console.log(process.env.NODE_ENV?.trim(), 'NODE_ENV');
  return {
    NODE_ENV: (Environments.includes(process.env.NODE_ENV?.trim())
      ? process.env.NODE_ENV.trim()
      : 'DEVELOPMENT') as EnvironmentsTypes,
    PORT: process.env.PORT || process.env.USERS_PORT,
    USERS_PORT: process.env.USERS_PORT,
    url: process.env.POSTGRES_URL,
    type: process.env.POSTGRES_TYPE,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    migrationsTableName: process.env.POSTGRES_MIGRATION_TABLE,
    // entities: [User, Profile],
    migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
    autoLoadEntities: process.env.AUTOLOAD_ENTITIES,
    synchronize: process.env.SYNCHRONIZE === 'true',
    dropSchema: process.env.DROP_SCHEMA === 'true',
    RMQ_URL: process.env.RMQ_URL,
    FILES_SERVICE_URL: process.env.FILES_SERVICE_URL,
    BUCKET: process.env.BUCKET,
    FILES_SERVICE_AVATAR_UPLOAD_PATH:
      process.env.FILES_SERVICE_AVATAR_UPLOAD_PATH,
    FILES_SERVICE_CHUNKS_DIR: process.env.FILES_SERVICE_CHUNKS_DIR,
  };
};

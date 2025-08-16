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
  console.log(process.env.NODE_ENV, 'NODE_ENV');
  return {
    NODE_ENV: (Environments.includes(process.env.NODE_ENV?.trim())
      ? process.env.NODE_ENV.trim()
      : 'DEVELOPMENT') as EnvironmentsTypes,
    PORT: process.env.PORT,
    url: process.env.POSTGRES_URL,
    type: process.env.POSTGRES_TYPE,
    autoLoadEntities: process.env.AUTOLOAD_ENTITIES === 'true',
    synchronize: process.env.SYNCHRONIZE === 'true',
    dropSchema: process.env.DROP_SCHEMA === 'true',
  };
};

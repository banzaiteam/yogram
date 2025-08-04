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
  return {
    NODE_ENV: (Environments.includes(process.env.NODE_ENV?.trim())
      ? process.env.NODE_ENV.trim()
      : 'DEVELOPMENT') as EnvironmentsTypes,
    PORT: process.env.PORT || process.env.POSTS_PORT,
    RMQ_URL: process.env.RMQ_URL,
    AWS_REGION: process.env.AWS_REGION,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    UPLOAD_SERVICE_URL_PREFIX: process.env.UPLOAD_SERVICE_URL_PREFIX,
    BUCKET: process.env.BUCKET,
  };
};

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
  const SERVICES_NAMES = ['USERS', 'POSTS', 'FILES'];
  console.log(
    'process.env.NODE_ENV in getonfigturation = ',
    process.env.NODE_ENV,
  );

  const SERVICES_URLS = SERVICES_NAMES.reduce<Record<string, string>>(
    (acc, u) => {
      Object.assign(acc, {
        [u + '_SERVICE_URL']:
          process.env.NODE_ENV === 'DEVELOPMENT' ||
          process.env.NODE_ENV === 'TESTING'
            ? `http://localhost:${process.env[u + '_PORT']}/api/v1`
            : `${process.env[u + '_PROD_SERVICE_URL']}/api/v1`,
      });
      return acc;
    },
    {},
  );
  console.log('SERVICES_URLS', SERVICES_URLS);

  console.log(process.env.NODE_ENV?.trim(), 'NODE_ENV--');
  return {
    NODE_ENV: (Environments.includes(process.env.NODE_ENV?.trim())
      ? process.env.NODE_ENV.trim()
      : 'DEVELOPMENT') as EnvironmentsTypes,
    PORT: process.env.PORT || process.env.GATE_PORT,
    USERS_PORT: process.env.USERS_PORT,
    POSTS_PORT: process.env.POSTS_PORT,
    FILES_PORT: process.env.FILES_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES,
    REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES,
    url: process.env.POSTGRES_URL,
    RMQ_URL: process.env.RMQ_URL,
    RESEND_EMAIL_VERIFY_PAGE: process.env.RESEND_EMAIL_VERIFY_PAGE,
    RECAPTCHA_HOSTNAME: process.env.RECAPTCHA_HOSTNAME,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    RECAPTCHA_URL: process.env.RECAPTCHA_URL,
    FORGOT_PASSWORD_TOKEN_EXPIRES: process.env.FORGOT_PASSWORD_TOKEN,
    SEND_RESTORE_PASSWORD_EMAIL_PAGE:
      process.env.SEND_RESTORE_PASSWORD_EMAIL_PAGE,
    LOGIN_PAGE: process.env.LOGIN_PAGE,
    RESTORE_PASSWORD_PAGE: process.env.RESTORE_PASSWORD_PAGE,
    GOOGLE_OAUTH_URI: process.env.GOOGLE_OAUTH_URI,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    ...SERVICES_URLS,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_USER: process.env.REDIS_USER,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    BUCKET: process.env.BUCKET,
    POSTS_SERVICE_URL: process.env.POSTS_SERVICE_URL,
    USERS_SERVICE_URL: process.env.USERS_SERVICE_URL,
    FILES_SERVICE_URL: process.env.FILES_SERVICE_URL,
  };
};

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
  console.log(process.env.NODE_ENV?.trim(), 'NODE_ENV--');
  return {
    NODE_ENV: (Environments.includes(process.env.NODE_ENV?.trim())
      ? process.env.NODE_ENV.trim()
      : 'DEVELOPMENT') as EnvironmentsTypes,
    PORT: process.env.PORT || process.env.GATE_PORT,
    USERS_PORT: process.env.USERS_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES,
    REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES,
    url: process.env.POSTGRES_URL,
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
  };
};

import dotenv from 'dotenv';

dotenv.config({ override: true });

const normalizeUrl = (url) => url.trim().replace(/\/$/, '');
const isProductionRuntime = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

const getRuntimeValue = (name) => process.env[name]?.trim() || '';

const frontendUrls = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((url) => normalizeUrl(url))
  .filter(Boolean);

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: getRuntimeValue('MONGODB_URI') || (isProductionRuntime ? '' : 'mongodb://127.0.0.1:27017/nexlance'),
  jwtSecret: getRuntimeValue('JWT_SECRET') || (isProductionRuntime ? '' : 'replace_with_secure_secret'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  frontendUrl: frontendUrls[0] || 'http://localhost:3000',
  frontendUrls,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProductionRuntime,
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFrom: process.env.SMTP_FROM || process.env.SMTP_USER || '',
  passwordResetOtpExpiresMinutes: Number(process.env.PASSWORD_RESET_OTP_EXPIRES_MINUTES || 10),
  squareEnvironment: process.env.SQUARE_ENVIRONMENT || 'sandbox',
  squareAccessToken: process.env.SQUARE_ACCESS_TOKEN || '',
  squareLocationId: process.env.SQUARE_LOCATION_ID || '',
  squareCurrency: process.env.SQUARE_CURRENCY || 'USD',
};

export const requireRuntimeEnv = (name, value) => {
  if (!value && env.isProductionRuntime) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

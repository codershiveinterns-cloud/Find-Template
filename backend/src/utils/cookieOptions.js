import { env } from '../config/env.js';

const isSecureCookie = env.nodeEnv === 'production' || process.env.VERCEL === '1' || process.env.RENDER === 'true';

export const authCookieOptions = {
  httpOnly: true,
  sameSite: isSecureCookie ? 'none' : 'lax',
  secure: isSecureCookie,
  path: '/',
};

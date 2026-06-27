import { env } from '../config/env.js';

const isSecureCookie = env.nodeEnv === 'production' || process.env.VERCEL === '1' || process.env.RENDER === 'true';
const sameSite = process.env.COOKIE_SAME_SITE || (isSecureCookie ? 'none' : 'lax');

export const authCookieOptions = {
  httpOnly: true,
  sameSite,
  secure: isSecureCookie,
  path: '/',
};

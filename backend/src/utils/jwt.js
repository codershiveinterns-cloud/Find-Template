import jwt from 'jsonwebtoken';
import { env, requireRuntimeEnv } from '../config/env.js';

const getJwtSecret = () => {
  const jwtSecret = requireRuntimeEnv('JWT_SECRET', env.jwtSecret);

  if (env.isProductionRuntime && jwtSecret === 'replace_with_secure_secret') {
    throw new Error('JWT_SECRET must be changed from the default placeholder in production');
  }

  return jwtSecret;
};

export const signToken = (payload) => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: env.jwtExpiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

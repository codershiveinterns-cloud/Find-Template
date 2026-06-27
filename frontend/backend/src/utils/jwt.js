import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const serverSessionId = randomUUID();

export const signToken = (payload) => {
  return jwt.sign({ ...payload, serverSessionId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

export const verifyToken = (token) => {
  const decoded = jwt.verify(token, env.jwtSecret);

  if (decoded.serverSessionId !== serverSessionId) {
    const error = new Error('Session expired');
    error.name = 'JsonWebTokenError';
    throw error;
  }

  return decoded;
};

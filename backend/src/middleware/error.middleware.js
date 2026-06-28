import { env } from '../config/env.js';

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  console.error('Request failed:', {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    name: error.name,
    message: error.message,
    stack: env.nodeEnv === 'production' ? undefined : error.stack,
  });

  const isServerError = statusCode >= 500;

  res.status(statusCode).json({
    success: false,
    message: isServerError && env.nodeEnv === 'production' ? 'Internal server error' : error.message || 'Server error',
  });
};

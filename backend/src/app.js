import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { getDBStatus } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import inquiryRoutes from './routes/inquiry.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import projectRoutes from './routes/project.routes.js';
import teamRoutes from './routes/team.routes.js';
import clientRoutes from './routes/client.routes.js';
import invoiceRoutes from './routes/invoice.routes.js';
import serviceRoutes from './routes/service.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

export const app = express();

const normalizeOrigin = (origin) => origin?.trim().replace(/\/$/, '');
const vercelOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
const vercelProductionOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : '';

const allowedOrigins = [
  ...env.frontendUrls,
  vercelOrigin,
  vercelProductionOrigin,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
]
  .map(normalizeOrigin)
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      const normalizedOrigin = normalizeOrigin(origin);

      if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      console.warn('CORS rejected origin:', normalizedOrigin);
      const error = new Error('Not allowed by CORS');
      error.statusCode = 403;
      return callback(error);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '3mb' }));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Nexlance API is running',
    data: {
      environment: env.nodeEnv,
      dbReadyState: getDBStatus().readyState,
    },
  });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/payments', paymentRoutes);

app.use(notFound);
app.use(errorHandler);

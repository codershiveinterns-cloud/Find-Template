import { app } from '../../../backend/src/app.js';
import { connectDB, getDBStatus } from '../../../backend/src/config/db.js';

let connectionPromise;

const getConnection = () => {
  if (!connectionPromise) {
    connectionPromise = connectDB().catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  return connectionPromise;
};

const getRequestPath = (req) => {
  if (Array.isArray(req.query.path)) {
    return req.query.path.join('/');
  }

  return req.query.path || '';
};

const logApiError = (label, req, error) => {
  console.error(label, {
    method: req.method,
    path: `/api/${getRequestPath(req)}`,
    name: error.name,
    message: error.message,
  });
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  const requestPath = getRequestPath(req);

  if (req.method === 'GET' && requestPath === 'health') {
    return res.status(200).json({
      success: true,
      message: 'Nexlance API bridge is running',
      data: {
        dbRequired: false,
        dbReadyState: getDBStatus().readyState,
      },
    });
  }

  if (req.method === 'GET' && requestPath === 'health/db') {
    try {
      await getConnection();

      return res.status(200).json({
        success: true,
        message: 'Database connection is healthy',
        data: getDBStatus(),
      });
    } catch (error) {
      logApiError('Database health check failed:', req, error);

      return res.status(503).json({
        success: false,
        message: 'Database unavailable',
        data: null,
      });
    }
  }

  try {
    await getConnection();
    return app(req, res);
  } catch (error) {
    logApiError('API request failed:', req, error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
}

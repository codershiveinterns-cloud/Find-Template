import { app } from '../backend/src/app.js';
import { connectDB } from '../backend/src/config/db.js';

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

export default async function handler(req, res) {
  try {
    await getConnection();
    return app(req, res);
  } catch (error) {
    console.error('API request failed:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
}

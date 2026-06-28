import mongoose from 'mongoose';
import { env, requireRuntimeEnv } from './env.js';

let connectionPromise;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = requireRuntimeEnv('MONGODB_URI', env.mongoUri);

  connectionPromise = mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => {
      console.log('MongoDB connected');
      return mongoose.connection;
    })
    .catch((error) => {
      connectionPromise = null;
      console.error('MongoDB connection failed:', {
        name: error.name,
        message: error.message,
      });
      throw error;
    });

  return connectionPromise;
};

export const getDBStatus = () => ({
  readyState: mongoose.connection.readyState,
});

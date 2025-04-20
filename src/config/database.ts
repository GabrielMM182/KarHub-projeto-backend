import mongoose from 'mongoose';
import { MONGODB_URI, MONGODB_URI_PROD } from './env';
import { logger } from '../utils/logger';

const uri = process.env.NODE_ENV === 'production' && MONGODB_URI_PROD
  ? MONGODB_URI_PROD
  : MONGODB_URI;

export async function connectDB() {
  try {
    await mongoose.connect(uri);
    logger.info('MongoDB connected successfully!');
  } catch (error) {
    logger.error({ err: error }, 'Error to connect to MongoDB');
    process.exit(1);
  }
}

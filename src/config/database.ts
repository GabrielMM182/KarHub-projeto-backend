import mongoose from 'mongoose';
import { MONGODB_URI } from './env';
import { logger } from '../utils/logger';

export async function connectDB() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found look again in .env');
    }
    await mongoose.connect(MONGODB_URI);
    logger.info('MongoDB connected successfully!');
  } catch (error) {
    logger.error({ err: error }, 'Error to connect to MongoDB');
    process.exit(1);
  }
}
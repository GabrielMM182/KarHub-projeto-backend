import mongoose from 'mongoose';
import { MONGODB_URI } from './env';
import { logger } from '../utils/logger';

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('MongoDB conectado com sucesso!');
  } catch (error) {
    logger.error({ err: error }, 'Erro ao conectar ao MongoDB');
    process.exit(1);
  }
}

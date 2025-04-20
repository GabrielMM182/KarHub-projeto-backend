import mongoose from 'mongoose';
import { Beer } from '../models/Beer.schema';
import { logger } from '../utils/logger';
import dotenv from 'dotenv';
import { MONGODB_URI, MONGODB_URI_PROD } from '../config/env';

dotenv.config();

const beers = [
  { name: 'Weissbier', minTemp: -1, maxTemp: 3 },
  { name: 'Pilsens', minTemp: -2, maxTemp: 4 },
  { name: 'Weizenbier', minTemp: -4, maxTemp: 6 },
  { name: 'Red ale', minTemp: -5, maxTemp: 5 },
  { name: 'India pale ale', minTemp: -6, maxTemp: 7 },
  { name: 'IPA', minTemp: -7, maxTemp: 10 },
  { name: 'Dunkel', minTemp: -8, maxTemp: 2 },
  { name: 'Imperial Stouts', minTemp: -10, maxTemp: 13 },
  { name: 'Brown ale', minTemp: 0, maxTemp: 14 },
];

const uri = process.env.NODE_ENV === 'production' && MONGODB_URI_PROD
  ? MONGODB_URI_PROD
  : MONGODB_URI;

async function seed() {
  try {
    if (!uri) {
      throw new Error('MONGODB_URI not found look again in .env');
    }
    await mongoose.connect(uri);
    await Beer.deleteMany({});
    await Beer.insertMany(beers);
    logger.info('Beers seeded successfully!');
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Error to start seeds');
    process.exit(1);
  }
}

seed();

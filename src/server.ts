import express from 'express';
import { PORT } from './config/env';
import { connectDB } from './config/database';
import { logger } from './utils/logger';

import beerRouter from './routes/beer.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use('/beers', beerRouter);

app.get('/', (_, res) => {
  res.json({ message: "Karhub API running!" });
});

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
  app.use(errorHandler);
}

startServer();

export default app;
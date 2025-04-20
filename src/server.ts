import express from 'express';
import { PORT } from './config/env';
import { connectDB } from './config/database';
import { logger } from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import beerRouter from './routes/beer.routes';
import { errorHandler } from './middlewares/errorHandler';

import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.json({ message: "Karhub API running!" });
});

app.use('/beers', beerRouter);

const swaggerDocument = YAML.load(path.join(__dirname, '..', 'swagger.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
  app.use(errorHandler);
}

startServer();

export default app;
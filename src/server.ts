import express from 'express';
import { PORT } from './config/env';
import { connectDB } from './config/database';

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
    console.log(`Server running on port ${PORT}`);
  });

  // Middleware de erro global
  app.use(errorHandler);
}

startServer();

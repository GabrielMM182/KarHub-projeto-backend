import express from 'express';
import { PORT } from './config/env';
import { connectDB } from './config/database';

const app = express();

app.get('/', (_, res) => {
  res.json({ message: "Karhub API running!" });
});

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

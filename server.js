import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import logger, { getTimestamp } from './config/logger.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5005;

connectDB();

app.get('/', (req, res) => {
  res.redirect('https://vaarplanner.nl');
});

app.get('/v1/status', (req, res) => {
  res.status(200).json({ message: 'Vaarplanner API V1 Online' });
});

app.use('/v1', userRoutes);

app.listen(PORT, () => {
  logger(`[${getTimestamp()}] 🚀 Server running on http://localhost:${PORT}`, 'yellow');
});
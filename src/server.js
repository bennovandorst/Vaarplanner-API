import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import log, { getTimestamp } from './config/logger.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type'
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const PORT = process.env.PORT || 5005;

connectDB();

app.get('/', (req, res) => {
  res.send('⛵️👀');
});

app.use('/uploads/avatars', express.static('uploads/avatars'));

app.get('/v1/status', (req, res) => {
  res.status(200).json({ message: 'Vaarplanner API V1 Online' });
});

app.use('/v1/user', userRoutes);
app.use('/v1/admin', adminRoutes);

app.listen(PORT, () => {
  log(`[${getTimestamp()}] 🚀 Server running on http://localhost:${PORT}`, 'yellow');
});
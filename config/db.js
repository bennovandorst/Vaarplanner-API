import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger(`[DB] ✅ MongoDB connected`, 'green');
  } catch (error) {
    logger(`[DB] ❌ MongoDB connection error: ${error}`, 'red');
    process.exit(1); // Exit the process if DB connection fails
  }
};

export default connectDB;
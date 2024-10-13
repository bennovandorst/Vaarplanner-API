import mongoose from 'mongoose';
import dotenv from 'dotenv';
import log from './logger.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    log(`[DB] ✅ MongoDB connected`, 'green');
  } catch (error) {
    log(`[DB] ❌ MongoDB connection error: ${error}`, 'red');
    process.exit(1); // Exit the process if DB connection fails
  }
};

export default connectDB;
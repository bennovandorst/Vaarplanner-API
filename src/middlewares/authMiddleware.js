import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import log, { getTimestamp } from '../config/logger.js';

export const authenticate = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    log(`[${getTimestamp()}] ❌ Invalid token: ${error}`, 'red');
  }
};

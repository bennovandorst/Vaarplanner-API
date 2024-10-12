import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import log from '../config/logger.js';
import { getTimestamp } from '../config/logger.js'; // Make sure to import getTimestamp

export const getUser = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    log(`[${getTimestamp()}] ❌ Internal server error: ${error}`, 'red');
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteAccount = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByIdAndDelete(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Account deleted successfully' });
    log(`[${getTimestamp()}] ✅ Account deleted successfully: ${user.username}`, 'blue');
  } catch (error) {
    log(`[${getTimestamp()}] ❌ Internal server error: ${error}`, 'red');
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateStatus = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const { status } = req.body;
  
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.status = status;
      await user.save();
  
      res.json({ message: 'Status updated successfully', user });
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      log(`[${getTimestamp()}] ❌ Internal server error: ${error}`, 'red');
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
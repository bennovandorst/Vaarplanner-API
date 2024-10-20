import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import log, { getTimestamp } from '../config/logger.js';
import fs from 'fs';
import path from 'path';

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

  export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json({ users });
    } catch (error) {
      log(`[${getTimestamp()}] ❌ Internal server error: ${error}`, 'red');
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.user.id);

        user.avatar = `${req.file.filename}`;
        await user.save();

        res.json({ message: 'Avatar uploaded successfully', avatar: user.avatar });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading avatar', error });
    }
};

export const updateAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        if (user.avatar) {
            const oldAvatarPath = path.join(__dirname, '..', '..', user.avatar);
            fs.unlink(oldAvatarPath, (err) => {
                if (err) console.log('Failed to delete old avatar:', err);
            });
        }

        user.avatar = `${req.file.filename}`;
        await user.save();

        res.json({ message: 'Avatar updated successfully', avatar: user.avatar });
    } catch (error) {
        res.status(500).json({ message: 'Error updating avatar', error });
    }
};

export const deleteAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.avatar) {
            const avatarPath = path.join(__dirname, '..', '..', user.avatar);
            fs.unlink(avatarPath, (err) => {
                if (err) console.log('Failed to delete avatar:', err);
            });

            user.avatar = null;
            await user.save();

            res.json({ message: 'Avatar deleted successfully' });
        } else {
            res.status(400).json({ message: 'No avatar to delete' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting avatar', error });
    }
};
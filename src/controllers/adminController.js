import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import log, { getTimestamp } from '../config/logger.js';

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.role !== 'Administrator') {
      return res.status(400).json({ message: 'Invalid credentials or not an admin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    log(`[${getTimestamp()}] ✅ Admin logged in: ${user.email}`, 'green');
    res.json({ token });
  } catch (error) {
    log(`[${getTimestamp()}] ❌ Admin login error: ${error}`, 'red');
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
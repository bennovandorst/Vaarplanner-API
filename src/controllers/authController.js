import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import log from '../config/logger.js';
import { getTimestamp } from '../config/logger.js'; // Make sure to import getTimestamp

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'User with this username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
    log(`[${getTimestamp()}] ✅ User registered successfully: ${username}`, 'blue');
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    log(`[${getTimestamp()}] ❌ Internal server error: ${error}`, 'red');
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
    log(`[${getTimestamp()}] ✅ User logged in successfully: ${user.username}`, 'yellow');
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    log(`[${getTimestamp()}] ❌ Internal server error: ${error}`, 'red');
  }
};
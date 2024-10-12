import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5005;

const getTimestamp = () => {
  return new Date().toISOString();
};

const getLogFileName = () => {
  const date = new Date().toISOString().split('T')[0];
  return path.join('logs', `server-${date}.log`);
};

const logToFile = (message) => {
  const logFileName = getLogFileName();
  fs.appendFileSync(logFileName, `${message}\n`);
};

const log = (message, colorFn = chalk.white) => {
  const coloredMessage = colorFn(message);
  console.log(coloredMessage);
  logToFile(message);
};

// Ensure logs directory exists
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => log(`[${getTimestamp()}] ✅ MongoDB connected`, chalk.green))
  .catch(err => log(`[${getTimestamp()}] ❌ MongoDB connection error: ${err}`, chalk.red));

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.redirect('https://vaarplanner.nl');
});

app.get('/v1/status', (req, res) => {
  res.status(200).json({ message: 'Vaarplanner API V1 Online' });
});

app.post('/v1/register', async (req, res) => {
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
    log(`[${getTimestamp()}] ✅ User registered successfully: ${username}`, chalk.green);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    log(`[${getTimestamp()}] ❌ Internal server error: ${error}`, chalk.red);
  }
});

app.post('/v1/login', async (req, res) => {
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
    log(`[${getTimestamp()}] ✅ User logged in successfully: ${user.username}`, chalk.green);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    log(`[${getTimestamp()}] ❌ Internal server error: ${error}`, chalk.red);
  }
});

app.get('/v1/user', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json({ user });
    log(`[${getTimestamp()}] 👤 User data fetched successfully: ${user.username}`, chalk.blue);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    log(`[${getTimestamp()}] ❌ Invalid token: ${error}`, chalk.red);
  }
});

// Delete Account Route
app.delete('/v1/delete-account', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByIdAndDelete(decoded.id);
    res.json({ message: 'Account deleted successfully' });
    log(`[${getTimestamp()}] ✅ Account deleted successfully: ${user.username}`, chalk.green);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    log(`[${getTimestamp()}] ❌ Internal server error: ${error}`, chalk.red);
  }
});

app.listen(PORT, () => {
  log(`[${getTimestamp()}] 🚀 Server running on http://localhost:${PORT}`, chalk.yellow);
});

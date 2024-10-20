import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
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
  status: {
    type: String,
    default: '⛵️',
  },
  role: {
    type: String,
    default: 'Gebruiker',
  },
  avatar: {
    type: String,
    required: false,
  }
});

const User = mongoose.model('User', userSchema);

export default User;
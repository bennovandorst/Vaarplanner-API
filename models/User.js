import mongoose from 'mongoose';

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
  status: {
    type: String,
    required: false,
    default: '⛵️',
  },
  role: {
    type: String,
    required: false,
    default: 'Gebruiker',
  },
});

const User = mongoose.model('User', userSchema);

export default User;
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'fallback_super_secret_key_12345';
  return jwt.sign({ id }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Signup Error Details:", error);
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error Details:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res, next) => {
  try {
    return res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

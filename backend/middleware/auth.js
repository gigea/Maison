const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes — must be logged in (expects access token)
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    if (req.user.isBanned) return res.status(403).json({ message: 'Account is banned' });
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// Admin only
const admin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Admin access required' });
};

// Generate access token (short-lived)
const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });

// Generate refresh token (long-lived)
const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

module.exports = { protect, admin, generateAccessToken, generateRefreshToken };

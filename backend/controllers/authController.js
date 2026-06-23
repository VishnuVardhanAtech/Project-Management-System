'use strict';
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

const sign = (user) => jwt.sign(
  { id: user.id, name: user.name, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  if (password.length < 6)
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  try {
    if (await User.findByEmail(email.toLowerCase()))
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create(name.trim(), email.toLowerCase(), hashed);
    const token  = sign(user);
    res.status(201).json({ success: true, token, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required.' });
  try {
    const user = await User.findByEmail(email.toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    const token = sign(user);
    const { password: _, ...safe } = user;
    res.json({ success: true, token, user: safe });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

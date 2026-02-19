const db = require('../models');
const { Admin } = db;
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register first admin (one-time)
const registerAdmin = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    const count = await Admin.count();
    if (count > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({ email, password, fullName });
    const token = generateToken(admin.id);

    res.json({ id: admin.id, email: admin.email, fullName: admin.fullName, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin.id);
    res.json({ id: admin.id, email: admin.email, fullName: admin.fullName, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if signup is available
const checkSignupAvailable = async (req, res) => {
  try {
    const count = await Admin.count();
    res.json({ available: count === 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerAdmin, loginAdmin, checkSignupAvailable };

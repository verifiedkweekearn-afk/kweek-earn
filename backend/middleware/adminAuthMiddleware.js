const jwt = require('jsonwebtoken');
const db = require('../models');
const Admin = db.Admin;

const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
      if (!req.admin) {
        return res.status(401).json({ message: 'Admin not found' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protectAdmin };

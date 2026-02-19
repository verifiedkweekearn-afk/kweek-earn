const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createWithdrawalRequest,
  getUserWithdrawals,
  initializePayment,
  verifyPayment,
  verifyPin
} = require('../controllers/withdrawalController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'proof-' + unique + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    ext && mime ? cb(null, true) : cb(new Error('Only JPG/PNG allowed'));
  }
});

// Routes - line 36 is one of these
router.post('/request', protect, createWithdrawalRequest);
router.get('/', protect, getUserWithdrawals);
router.post('/:id/pay-fee', protect, initializePayment);
router.post('/:id/verify', protect, upload.single('screenshot'), verifyPayment);
router.post('/:id/verify-pin', protect, verifyPin);

module.exports = router;

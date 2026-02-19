const db = require('../models');
const { WithdrawalRequest, User } = db;
const fs = require('fs');

// @desc    Create withdrawal request
const createWithdrawalRequest = async (req, res) => {
  try {
    const { amount, accountName, accountNumber, bankName } = req.body;
    const userId = req.user.id;

    if (!amount || amount < 30000) {
      return res.status(400).json({ message: 'Minimum withdrawal is ₦30,000' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    const existing = await WithdrawalRequest.findOne({
      where: { userId, status: 'pending_fee' }
    });
    if (existing) {
      return res.status(400).json({ 
        message: 'You have a pending withdrawal',
        requestId: existing.id
      });
    }

    const withdrawal = await WithdrawalRequest.create({
      userId,
      amount,
      accountName,
      accountNumber,
      bankName,
      status: 'pending_fee',
      expiresAt: new Date(Date.now() + 15 * 60000)
    });

    user.balance -= amount;
    await user.save();

    res.status(201).json({
      message: 'Withdrawal created',
      requestId: withdrawal.id,
      amount: withdrawal.amount,
      expiresAt: withdrawal.expiresAt
    });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user withdrawals
const getUserWithdrawals = async (req, res) => {
  try {
    const withdrawals = await WithdrawalRequest.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Initialize payment
const initializePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const withdrawal = await WithdrawalRequest.findOne({
      where: { id, userId, status: 'pending_fee' }
    });

    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });

    if (new Date() > new Date(withdrawal.expiresAt)) {
      withdrawal.status = 'expired';
      await withdrawal.save();
      const user = await User.findByPk(userId);
      user.balance += withdrawal.amount;
      await user.save();
      return res.status(400).json({ message: 'Expired' });
    }

    res.json({
      message: 'Payment initialized',
      requestId: withdrawal.id,
      paymentDetails: {
        bank_name: 'SmartCash Payment Service Bank',
        account_number: '0346988943',
        account_name: 'SIDIKAT FAROJOYE',
        amount: 7000,
        expires_at: withdrawal.expiresAt
      }
    });
  } catch (error) {
    console.error('Init error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const file = req.file;

    const withdrawal = await WithdrawalRequest.findOne({
      where: { id, userId, status: 'pending_fee' }
    });

    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });

    if (new Date() > new Date(withdrawal.expiresAt)) {
      withdrawal.status = 'expired';
      await withdrawal.save();
      const user = await User.findByPk(userId);
      user.balance += withdrawal.amount;
      await user.save();
      return res.status(400).json({ message: 'Expired' });
    }

    if (file) {
      withdrawal.screenshotPath = file.path;
      withdrawal.screenshotUploadedAt = new Date();
    }

    withdrawal.status = 'waitlist';
    withdrawal.waitlistedAt = new Date();
    await withdrawal.save();

    res.json({
      message: 'Payment proof uploaded',
      requestId: withdrawal.id
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify PIN
const verifyPin = async (req, res) => {
  try {
    const { id } = req.params;
    const { pin } = req.body;
    const userId = req.user.id;

    const withdrawal = await WithdrawalRequest.findOne({
      where: { id, userId }
    });

    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    // Normalize both PINs
    const normalizePin = (p) => p.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const storedPin = normalizePin(withdrawal.pin || '');
    const enteredPin = normalizePin(pin);

    if (!storedPin || storedPin !== enteredPin) {
      return res.status(401).json({ message: 'Invalid PIN' });
    }

    withdrawal.status = 'pin_confirmed';
    withdrawal.pinConfirmedAt = new Date();
    await withdrawal.save();

    res.json({ message: 'PIN verified successfully', verified: true });
  } catch (error) {
    console.error('PIN verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ MAKE SURE ALL FUNCTIONS ARE EXPORTED
module.exports = {
  createWithdrawalRequest,
  getUserWithdrawals,
  initializePayment,
  verifyPayment,
  verifyPin
};

const db = require('../models');
const { WithdrawalRequest, User } = db;
const crypto = require('crypto');

const generatePin = () => {
  const random = crypto.randomBytes(8).toString('hex').toUpperCase();
  return `${random.slice(0,4)}-${random.slice(4,8)}-${random.slice(8,12)}-${random.slice(12,16)}`;
};

// Get all withdrawals
const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await WithdrawalRequest.findAll({
      include: [{ model: User, attributes: ['username', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ withdrawals });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate PIN
const generateWithdrawalPin = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawal = await WithdrawalRequest.findByPk(id);
    if (!withdrawal) return res.status(404).json({ message: 'Not found' });

    withdrawal.pin = generatePin();
    withdrawal.status = 'pin_generated';
    withdrawal.pinGeneratedAt = new Date();
    await withdrawal.save();

    res.json({ message: 'PIN generated', pin: withdrawal.pin });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark as sent
const markAsSent = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawal = await WithdrawalRequest.findByPk(id);
    if (!withdrawal) return res.status(404).json({ message: 'Not found' });

    withdrawal.status = 'completed';
    withdrawal.completedAt = new Date();
    await withdrawal.save();

    res.json({ message: 'Marked as sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllWithdrawals, generateWithdrawalPin, markAsSent };

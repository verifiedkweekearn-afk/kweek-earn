const crypto = require('crypto');

const generatePin = () => {
  // Generate 16 character alphanumeric PIN in XXXX-XXXX-XXXX-XXXX format (19 chars total)
  const random = crypto.randomBytes(8).toString('hex').toUpperCase();
  const parts = [
    random.slice(0, 4),
    random.slice(4, 8),
    random.slice(8, 12),
    random.slice(12, 16)
  ];
  return parts.join('-');
};

module.exports = generatePin;

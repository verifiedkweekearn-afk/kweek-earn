const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WithdrawalRequest = sequelize.define('WithdrawalRequest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 30000
      }
    },
    status: {
      type: DataTypes.ENUM(
        'pending_fee',
        'fee_paid',
        'pin_generated',
        'pin_confirmed',
        'processing',
        'completed',
        'failed',
        'expired'
      ),
      defaultValue: 'pending_fee'
    },
    feePaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    feeAmount: {
      type: DataTypes.INTEGER,
      defaultValue: 7000
    },
    pin: {
      type: DataTypes.STRING(19), // Changed from 16 to 19 to accommodate hyphens
      allowNull: true
    },
    pinGeneratedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pinConfirmedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => new Date(Date.now() + 15 * 60000)
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    flutterwaveReference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    flutterwaveStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    indexes: [
      {
        fields: ['userId', 'status']
      },
      {
        fields: ['pin'],
        unique: true,
        allowNull: true
      },
      {
        fields: ['expiresAt']
      }
    ]
  });

  return WithdrawalRequest;
};

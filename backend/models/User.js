const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    themePreference: {
      type: DataTypes.ENUM('dark', 'light'),
      defaultValue: 'dark'
    },
    withdrawalPin: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    penaltyCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    referralCode: {
      type: DataTypes.STRING(8),
      unique: true,
      defaultValue: () => uuidv4().slice(0, 8).toUpperCase()
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    deactivated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deactivatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notificationPreferences: {
      type: DataTypes.JSONB,
      defaultValue: {
        email: true,
        withdrawal: true,
        tasks: true,
        marketing: false
      }
    },
    loginHistory: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    failedPinAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    pinLockUntil: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // Phyllo integration fields
    phylloUserId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    connectedAccounts: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    lastVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  return User;
};

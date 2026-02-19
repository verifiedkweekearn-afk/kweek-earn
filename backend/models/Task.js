const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    platform: {
      type: DataTypes.ENUM(
        'facebook',
        'instagram',
        'tiktok',
        'twitter',
        'threads',
        'youtube',
        'snapchat'
      ),
      allowNull: false
    },
    action: {
      type: DataTypes.ENUM('follow', 'like', 'share', 'subscribe', 'retweet', 'repost'),
      allowNull: false
    },
    handle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reward: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['platform', 'action', 'handle']
      },
      {
        fields: ['platform']
      },
      {
        fields: ['action']
      },
      {
        fields: ['active']
      }
    ]
  });

  return Task;
};

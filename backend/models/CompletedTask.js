const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CompletedTask = sequelize.define('CompletedTask', {
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
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Tasks',
        key: 'id'
      }
    },
    completedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    handle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reward: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'taskId']
      },
      {
        fields: ['userId', 'completedAt']
      },
      {
        fields: ['taskId']
      }
    ]
  });

  return CompletedTask;
};

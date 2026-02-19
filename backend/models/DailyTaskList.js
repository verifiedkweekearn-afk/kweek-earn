const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DailyTaskList = sequelize.define('DailyTaskList', {
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
    status: {
      type: DataTypes.ENUM('pending', 'completed'),
      defaultValue: 'pending'
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    assignedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: () => new Date().toISOString().split('T')[0]
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'taskId', 'assignedDate']
      }
    ]
  });

  return DailyTaskList;
};

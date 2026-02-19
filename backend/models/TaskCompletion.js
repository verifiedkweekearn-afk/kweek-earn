const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TaskCompletion = sequelize.define('TaskCompletion', {
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
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'taskId']
      }
    ]
  });

  return TaskCompletion;
};

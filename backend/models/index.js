const { sequelize } = require('../config/db');
const UserModel = require('./User');
const TaskModel = require('./Task');
const UserTaskModel = require('./UserTask');
const TaskCompletionModel = require('./TaskCompletion');
const WithdrawalRequestModel = require('./WithdrawalRequest');
const AdminModel = require('./Admin');

const User = UserModel(sequelize);
const Task = TaskModel(sequelize);
const UserTask = UserTaskModel(sequelize);
const TaskCompletion = TaskCompletionModel(sequelize);
const WithdrawalRequest = WithdrawalRequestModel(sequelize);
const Admin = AdminModel(sequelize);

// Associations
User.hasMany(UserTask, { foreignKey: 'userId' });
UserTask.belongsTo(User, { foreignKey: 'userId' });

Task.hasMany(UserTask, { foreignKey: 'taskId' });
UserTask.belongsTo(Task, { foreignKey: 'taskId' });

User.hasMany(TaskCompletion, { foreignKey: 'userId' });
TaskCompletion.belongsTo(User, { foreignKey: 'userId' });

Task.hasMany(TaskCompletion, { foreignKey: 'taskId' });
TaskCompletion.belongsTo(Task, { foreignKey: 'taskId' });

User.hasMany(WithdrawalRequest, { foreignKey: 'userId' });
WithdrawalRequest.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Task,
  UserTask,
  TaskCompletion,
  WithdrawalRequest,
  Admin
};

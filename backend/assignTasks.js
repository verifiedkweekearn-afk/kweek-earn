const { DailyTaskList, Task, User } = require('./models');
const { sequelize } = require('./config/db');

(async () => {
  try {
    const tasks = await Task.findAll({ where: { active: true } });
    if (tasks.length === 0) {
      console.log('No tasks found. Run seedTasks.js first.');
      return;
    }
    
    const users = await User.findAll({ where: { isActive: true } });
    const today = new Date().toISOString().split('T')[0];
    let count = 0;
    
    for (const user of users) {
      const shuffled = [...tasks].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 55);
      const assignments = selected.map(t => ({
        userId: user.id,
        taskId: t.id,
        assignedDate: today
      }));
      
      await DailyTaskList.bulkCreate(assignments);
      count += assignments.length;
    }
    
    console.log('Assigned ' + count + ' tasks for ' + users.length + ' users');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
})();

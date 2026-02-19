const { generateHandles } = require('./generateNames');
const { createTasks } = require('./createTasks');
const { sequelize } = require('../config/db');
const { Task } = require('../models');

const seedAll = async () => {
  console.log('========================================');
  console.log('KWEEK EARN - MASSIVE TASK SEEDER');
  console.log('========================================');
  
  const startTime = Date.now();
  
  try {
    await sequelize.sync();
    
    // Step 1: Clear existing tasks (optional)
    console.log('\n[Step 1] Clearing existing tasks...');
    const deleted = await Task.destroy({ where: {} });
    console.log(`✅ Removed ${deleted} existing tasks`);
    
    // Step 2: Generate handles
    console.log('\n[Step 2] Generating 50 million handles...');
    const handles = generateHandles();
    
    // Step 3: Create tasks
    console.log('\n[Step 3] Creating tasks from handles...');
    const totalTasks = await createTasks(handles);
    
    const totalTime = ((Date.now() - startTime) / 60).toFixed(1);
    
    console.log('\n========================================');
    console.log('✅ SEEDING COMPLETE');
    console.log('========================================');
    console.log(`📊 Total tasks created: ${totalTasks.toLocaleString()}`);
    console.log(`⏱️  Total time: ${totalTime} minutes`);
    console.log('========================================');
    
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedAll();
}

module.exports = seedAll;

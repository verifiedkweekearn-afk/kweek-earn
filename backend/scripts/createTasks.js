const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { sequelize } = require('../config/db');
const { Task } = require('../models');
const { PLATFORMS, REWARDS, BATCH_SIZE } = require('../utils/seedHelper');

const createTasks = async (handlesFile) => {
  console.log('Starting task creation (streaming mode)...');
  console.log(`Reading handles from: ${handlesFile}`);
  
  const startTime = Date.now();
  let totalTasks = 0;
  let handleCount = 0;
  let batch = [];
  
  const fileStream = fs.createReadStream(handlesFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  for await (const line of rl) {
    // Skip JSON array brackets and empty lines
    if (line === '[' || line === ']' || line.trim() === '') continue;
    
    // Parse handle (remove quotes and trailing comma)
    const handle = line.replace(/[",]/g, '').trim();
    if (!handle) continue;
    
    handleCount++;
    
    // Create tasks for this handle
    for (const platform of PLATFORMS) {
      for (const action of platform.actions) {
        const task = {
          platform: platform.name,
          action: action,
          handle: handle,
          verified: Math.random() < 0.3,
          reward: REWARDS[action] || 200,
          active: true,
          url: platform.urlPattern(handle)
        };
        
        batch.push(task);
        
        if (batch.length >= BATCH_SIZE) {
          await Task.bulkCreate(batch);
          totalTasks += batch.length;
          batch = [];
          
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          const rate = (totalTasks / elapsed).toFixed(0);
          console.log(`Created ${totalTasks.toLocaleString()} tasks from ${handleCount.toLocaleString()} handles in ${elapsed}s (${rate}/sec)`);
        }
      }
    }
    
    if (handleCount % 1000 === 0) {
      console.log(`Processed ${handleCount.toLocaleString()} handles...`);
    }
  }
  
  // Insert remaining tasks
  if (batch.length > 0) {
    await Task.bulkCreate(batch);
    totalTasks += batch.length;
  }
  
  const totalTime = ((Date.now() - startTime) / 60).toFixed(1);
  console.log('========================================');
  console.log(`✅ Task creation complete`);
  console.log(`📊 Total tasks: ${totalTasks.toLocaleString()}`);
  console.log(`📊 Total handles: ${handleCount.toLocaleString()}`);
  console.log(`⏱️  Time taken: ${totalTime} minutes`);
  console.log('========================================');
  
  return totalTasks;
};

// Run if called directly
if (require.main === module) {
  (async () => {
    try {
      await sequelize.sync();
      
      const handlesFile = path.join(__dirname, '../data/allHandles.json');
      if (!fs.existsSync(handlesFile)) {
        console.error('Handles file not found. Run generateNames.js first.');
        process.exit(1);
      }
      
      await createTasks(handlesFile);
      process.exit(0);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = { createTasks };

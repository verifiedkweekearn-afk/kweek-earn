const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/db');
const { Task } = require('../models');

const PLATFORMS = [
  {
    name: 'instagram',
    actions: ['follow', 'like', 'share'],
    urlPattern: (handle) => `https://instagram.com/${handle.replace(/_/g, '').replace('@', '')}`
  },
  {
    name: 'facebook',
    actions: ['follow', 'like', 'share'],
    urlPattern: (handle) => `https://facebook.com/${handle}`
  },
  {
    name: 'tiktok',
    actions: ['follow', 'like', 'share'],
    urlPattern: (handle) => `https://tiktok.com/@${handle}`
  },
  {
    name: 'twitter',
    actions: ['follow', 'like', 'retweet'],
    urlPattern: (handle) => `https://twitter.com/${handle}`
  },
  {
    name: 'youtube',
    actions: ['subscribe', 'like', 'share'],
    urlPattern: (handle) => `https://youtube.com/@${handle}`
  },
  {
    name: 'snapchat',
    actions: ['follow', 'like', 'share'],
    urlPattern: (handle) => `https://snapchat.com/add/${handle}`
  },
  {
    name: 'threads',
    actions: ['follow', 'like', 'repost'],
    urlPattern: (handle) => `https://threads.net/@${handle}`
  }
];

const REWARDS = {
  follow: 300,
  like: 150,
  share: 200,
  subscribe: 300,
  retweet: 200,
  repost: 200
};

const BATCH_SIZE = 1000;

const createTasksFromHandles = async (handles, onProgress) => {
  console.log('Starting task creation...');
  console.log(`Processing ${handles.length.toLocaleString()} handles`);
  
  const startTime = Date.now();
  let totalTasks = 0;
  let batch = [];
  
  for (let i = 0; i < handles.length; i++) {
    const handle = handles[i];
    
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
          
          if (onProgress) {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            const rate = (totalTasks / elapsed).toFixed(0);
            onProgress(totalTasks, elapsed, rate);
          }
        }
      }
    }
    
    if ((i + 1) % 1000 === 0 && onProgress) {
      const percent = ((i + 1) / handles.length * 100).toFixed(1);
      onProgress(null, null, null, i + 1, percent);
    }
  }
  
  if (batch.length > 0) {
    await Task.bulkCreate(batch);
    totalTasks += batch.length;
  }
  
  return totalTasks;
};

module.exports = {
  PLATFORMS,
  REWARDS,
  BATCH_SIZE,
  createTasksFromHandles
};

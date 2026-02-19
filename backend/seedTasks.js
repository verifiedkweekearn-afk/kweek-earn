const { sequelize } = require('./config/db');
const db = require('./models');
const Task = db.Task;

const platforms = ['facebook', 'instagram', 'tiktok', 'twitter', 'threads', 'youtube', 'snapchat'];
const actions = ['follow', 'like', 'share'];
const rewardMap = { follow: 300, like: 150, share: 200 };

// Sample handles (you can expand this list)
const handles = [
  { name: '@cristiano', verified: true },
  { name: '@elonmusk', verified: true },
  { name: '@natgeo', verified: true },
  { name: '@spotify', verified: true },
  { name: '@netflix', verified: true },
  { name: '@nike', verified: true },
  { name: '@techcrunch', verified: true },
  { name: '@bbcnews', verified: true },
  { name: '@cnn', verified: true },
  { name: '@vogue', verified: true },
  { name: '@fashionnova', verified: true },
  { name: '@mrbeast', verified: true },
  { name: '@billieeilish', verified: true },
  { name: '@taylorswift', verified: true },
  { name: '@selenagomez', verified: true },
  { name: '@zendaya', verified: true },
  { name: '@davido', verified: true },
  { name: '@burnaboy', verified: true },
  { name: '@wizkidayo', verified: true },
  { name: '@tiwasavage', verified: true },
  { name: '@yemialade', verified: true },
  // Non-verified (random influencers)
  { name: '@fitness_tips_ng', verified: false },
  { name: '@lagosfoodie', verified: false },
  { name: '@abujavibes', verified: false },
  { name: '@techpadi', verified: false },
  { name: '@naijablogger', verified: false },
  { name: '@streetstyle_africa', verified: false },
  { name: '@africanmusicdaily', verified: false },
  { name: '@sportz_arena', verified: false },
  { name: '@movie_clips_ng', verified: false },
  { name: '@gistlover', verified: false }
];

const seedTasks = async () => {
  try {
    await sequelize.sync({ force: false });
    
    // Clear existing tasks (optional – comment out if you want to keep)
    // await Task.destroy({ where: {}, truncate: true });
    
    const tasks = [];
    
    for (const platform of platforms) {
      for (const action of actions) {
        for (const handle of handles) {
          // Randomize: not every handle appears on every platform
          if (Math.random() < 0.6) { // 60% chance to include
            tasks.push({
              platform,
              action,
              handle: handle.name,
              verified: handle.verified,
              reward: rewardMap[action]
            });
          }
        }
      }
    }
    
    // Shuffle and limit to avoid duplicates
    const shuffled = tasks.sort(() => 0.5 - Math.random());
    const unique = [];
    const seen = new Set();
    
    for (const task of shuffled) {
      const key = `${task.platform}-${task.action}-${task.handle}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(task);
      }
    }
    
    await Task.bulkCreate(unique);
    console.log(`✅ Seeded ${unique.length} unique tasks`);
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    process.exit(0);
  }
};

seedTasks();

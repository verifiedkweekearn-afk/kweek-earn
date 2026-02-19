const { connectDB } = require('./config/db');

(async () => {
  await connectDB();
  console.log('Connection test passed. Ready to build.');
  process.exit(0);
})();

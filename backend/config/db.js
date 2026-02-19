const { Sequelize } = require('sequelize');

// Get current Termux username – usually 'u0_aXXX' – from environment
const USER = process.env.USER || 'u0_a103'; // fallback to your shown owner

const sequelize = new Sequelize('kweekearn', USER, null, {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  logging: false,
  dialectOptions: {
    socketPath: '/data/data/com.termux/files/usr/var/run/postgresql/.s.PGSQL.5432'
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected (Kweek Earn)');
  } catch (error) {
    console.error('❌ DB connection failed:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

const { Sequelize } = require('sequelize');

let sequelize;

// Use DATABASE_URL from environment if available (for production)
if (process.env.DATABASE_URL) {
  console.log('📡 Using remote database from DATABASE_URL');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false  // ← THIS IS THE KEY FIX
      }
    }
  });
} else {
  // Fallback to local development database
  console.log('💻 Using local development database');
  const USER = process.env.USER || 'u0_a103';
  sequelize = new Sequelize('kweekearn', USER, null, {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    logging: false,
    dialectOptions: {
      socketPath: '/data/data/com.termux/files/usr/var/run/postgresql/.s.PGSQL.5432'
    }
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

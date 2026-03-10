const { sequelize } = require('./postgres');
const Task = require('../models/Task');

const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // Test the connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Sync all models
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database tables created/updated successfully');
    
    // Check if we have any existing data
    const taskCount = await Task.count();
    console.log(`📊 Current tasks in database: ${taskCount}`);
    
    if (taskCount === 0) {
      console.log('💡 Database is empty. You can add sample data using the seed script.');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Database initialization completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
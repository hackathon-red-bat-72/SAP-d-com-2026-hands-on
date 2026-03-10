const { sequelize } = require('./src/config/postgres');
const Task = require('./src/models/Task');

const seedTasks = [
  {
    title: 'Setup Development Environment',
    description: 'Configure development tools and environment variables',
    priority: 'High',
    status: 'Completed',
    dueDate: '2025-09-25T09:00:00.000Z'
  },
  {
    title: 'Write API Documentation',
    description: 'Document all API endpoints with examples',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2025-09-28T17:00:00.000Z'
  },
  {
    title: 'Implement Frontend UI',
    description: 'Create user interface for task management',
    priority: 'High',
    status: 'Pending',
    dueDate: '2025-10-01T12:00:00.000Z'
  },
  {
    title: 'Write Unit Tests',
    description: 'Add comprehensive test coverage for all endpoints',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '2025-09-30T15:00:00.000Z'
  }
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync tables (recreate them)
    await sequelize.sync({ force: true });
    console.log('✅ Database tables recreated');
    
    // Insert seed data
    const createdTasks = await Task.bulkCreate(seedTasks);
    console.log(`✅ Successfully inserted ${createdTasks.length} test tasks`);
    
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database seeding failed:', err);
    process.exit(1);
  }
}

seed();

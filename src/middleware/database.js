const { sequelize } = require('../config/postgres');

// Middleware to check database connection
const checkDBConnection = async (req, res, next) => {
  try {
    await sequelize.authenticate();
    next();
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: 'Database connection not available. Please ensure PostgreSQL is running.',
      error: 'DATABASE_UNAVAILABLE',
      details: error.message,
      documentation: '/api-docs'
    });
  }
};

module.exports = {
  checkDBConnection
};
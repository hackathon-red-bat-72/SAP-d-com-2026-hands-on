const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Task Manager API Documentation'
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Task Manager API is running (Test Mode)',
    timestamp: new Date().toISOString(),
    environment: 'test'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Task Manager API (Test Mode)',
    version: '1.0.0',
    documentation: {
      swagger: '/api-docs',
      endpoints: {
        health: '/health'
      }
    }
  });
});

// Mock task endpoint for testing
app.get('/api/v1/tasks', (req, res) => {
  res.status(503).json({
    success: false,
    message: 'Database not connected. This is a test server for documentation only.',
    documentation: '/api-docs'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    documentation: '/api-docs'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
🧪 Test Server Running!
📍 Port: ${PORT}
📖 Swagger UI: http://localhost:${PORT}/api-docs
🔍 Health Check: http://localhost:${PORT}/health
⚠️  Note: This is a test server for Swagger documentation only.
  `);
});

module.exports = app;
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Task Manager API',
    version: '1.0.0',
    description: 'A comprehensive REST API for managing tasks with priorities, due dates, and filtering capabilities.',
    contact: {
      name: 'API Support',
      email: 'support@taskmanager.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Development server'
    },
    {
      url: 'https://your-production-domain.com/api/v1',
      description: 'Production server'
    }
  ],
  components: {
    schemas: {
      Task: {
        type: 'object',
        required: ['title'],
        properties: {
          id: {
            type: 'integer',
            description: 'Auto-generated PostgreSQL integer ID',
            example: 1
          },
          title: {
            type: 'string',
            maxLength: 100,
            description: 'Task title',
            example: 'Complete project documentation'
          },
          description: {
            type: 'string',
            maxLength: 500,
            description: 'Detailed task description',
            example: 'Write comprehensive API documentation with examples'
          },
          priority: {
            type: 'string',
            enum: ['Low', 'Medium', 'High'],
            description: 'Task priority level',
            default: 'Medium',
            example: 'High'
          },
          status: {
            type: 'string',
            enum: ['Pending', 'In Progress', 'Completed'],
            description: 'Current task status',
            default: 'Pending',
            example: 'Pending'
          },
          dueDate: {
            type: 'string',
            format: 'date-time',
            description: 'Task due date (ISO 8601 format)',
            example: '2025-09-30T17:00:00.000Z'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Task creation timestamp',
            example: '2025-09-22T10:00:00.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            example: '2025-09-22T10:00:00.000Z'
          },
          isOverdue: {
            type: 'boolean',
            description: 'Virtual field indicating if task is overdue',
            example: false
          },
          daysUntilDue: {
            type: 'number',
            description: 'Virtual field showing days until due date',
            example: 8
          }
        }
      },
      TaskInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: {
            type: 'string',
            maxLength: 100,
            description: 'Task title',
            example: 'Complete project documentation'
          },
          description: {
            type: 'string',
            maxLength: 500,
            description: 'Detailed task description',
            example: 'Write comprehensive API documentation with examples'
          },
          priority: {
            type: 'string',
            enum: ['Low', 'Medium', 'High'],
            description: 'Task priority level',
            example: 'High'
          },
          status: {
            type: 'string',
            enum: ['Pending', 'In Progress', 'Completed'],
            description: 'Current task status',
            example: 'Pending'
          },
          dueDate: {
            type: 'string',
            format: 'date-time',
            description: 'Task due date (ISO 8601 format)',
            example: '2025-09-30T17:00:00.000Z'
          }
        }
      },
      TaskUpdate: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            maxLength: 100,
            description: 'Task title',
            example: 'Complete project documentation'
          },
          description: {
            type: 'string',
            maxLength: 500,
            description: 'Detailed task description',
            example: 'Write comprehensive API documentation with examples'
          },
          priority: {
            type: 'string',
            enum: ['Low', 'Medium', 'High'],
            description: 'Task priority level',
            example: 'Medium'
          },
          status: {
            type: 'string',
            enum: ['Pending', 'In Progress', 'Completed'],
            description: 'Current task status',
            example: 'In Progress'
          },
          dueDate: {
            type: 'string',
            format: 'date-time',
            description: 'Task due date (ISO 8601 format)',
            example: '2025-09-30T17:00:00.000Z'
          }
        }
      },
      TaskList: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              tasks: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Task'
                }
              },
              pagination: {
                type: 'object',
                properties: {
                  currentPage: {
                    type: 'number',
                    example: 1
                  },
                  totalPages: {
                    type: 'number',
                    example: 5
                  },
                  totalTasks: {
                    type: 'number',
                    example: 47
                  },
                  tasksPerPage: {
                    type: 'number',
                    example: 10
                  }
                }
              }
            }
          }
        }
      },
      TaskResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: 'Task created successfully'
          },
          data: {
            $ref: '#/components/schemas/Task'
          }
        }
      },
      TaskStats: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              total: {
                type: 'number',
                description: 'Total number of tasks',
                example: 25
              },
              pending: {
                type: 'number',
                description: 'Number of pending tasks',
                example: 10
              },
              inProgress: {
                type: 'number',
                description: 'Number of tasks in progress',
                example: 8
              },
              completed: {
                type: 'number',
                description: 'Number of completed tasks',
                example: 7
              },
              overdue: {
                type: 'number',
                description: 'Number of overdue tasks',
                example: 3
              },
              high: {
                type: 'number',
                description: 'Number of high priority tasks',
                example: 5
              },
              medium: {
                type: 'number',
                description: 'Number of medium priority tasks',
                example: 12
              },
              low: {
                type: 'number',
                description: 'Number of low priority tasks',
                example: 8
              }
            }
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: 'Validation failed'
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  example: 'title'
                },
                message: {
                  type: 'string',
                  example: 'Title is required'
                }
              }
            }
          }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js', './server.js'], // Path to the API files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
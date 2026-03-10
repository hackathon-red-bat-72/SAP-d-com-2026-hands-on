const Task = require('../models/Task');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Get all tasks with filtering options
const getTasks = async (req, res) => {
  try {
    const {
      status,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      dueDateFrom,
      dueDateTo,
      overdue
    } = req.query;

    // Build where clause for Sequelize
    const where = {};

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Date range filtering
    if (dueDateFrom || dueDateTo) {
      where.dueDate = {};
      if (dueDateFrom) {
        where.dueDate[Op.gte] = new Date(dueDateFrom);
      }
      if (dueDateTo) {
        where.dueDate[Op.lte] = new Date(dueDateTo);
      }
    }

    // Overdue filter
    // Note: If both date range and overdue are provided, overdue takes precedence
    // as it's a more specific filter (tasks due before today)
    if (overdue === 'true') {
      // Overdue filter: dueDate < today AND status != 'Completed'
      where.dueDate = { [Op.lt]: new Date() };
      where.status = { [Op.ne]: 'Completed' };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Sort configuration
    const order = [[sortBy, sortOrder.toUpperCase()]];

    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      order,
      offset,
      limit: limitNum
    });

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(count / limitNum),
          totalTasks: count,
          tasksPerPage: limitNum
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

// Get single task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
};

// Create new task
const createTask = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, priority, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : null
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

// Update task (PUT - full update)
const updateTask = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, priority, status, dueDate } = req.body;

    const [updatedRowsCount, [updatedTask]] = await Task.update(
      {
        title,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : null
      },
      {
        where: { id: req.params.id },
        returning: true
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

// Partial update task (PATCH)
const patchTask = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updateData = {};
    const { title, description, priority, status, dueDate } = req.body;

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const [updatedRowsCount, [updatedTask]] = await Task.update(
      updateData,
      {
        where: { id: req.params.id },
        returning: true
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const deletedRowsCount = await Task.destroy({
      where: { id: req.params.id }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};

// Get task statistics
const getTaskStats = async (req, res) => {
  try {
    const totalTasks = await Task.count();
    
    const statusCounts = await Task.findAll({
      attributes: [
        'status',
        [Task.sequelize.fn('COUNT', Task.sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    const priorityCounts = await Task.findAll({
      attributes: [
        'priority',
        [Task.sequelize.fn('COUNT', Task.sequelize.col('priority')), 'count']
      ],
      group: ['priority']
    });

    // Count overdue tasks
    const overdueCount = await Task.count({
      where: {
        dueDate: { [Op.lt]: new Date() },
        status: { [Op.ne]: 'Completed' }
      }
    });

    // Count completed tasks
    const completedCount = await Task.count({
      where: { status: 'Completed' }
    });

    // Format the response
    const statusStats = {};
    statusCounts.forEach(item => {
      statusStats[item.dataValues.status] = parseInt(item.dataValues.count);
    });

    const priorityStats = {};
    priorityCounts.forEach(item => {
      priorityStats[item.dataValues.priority] = parseInt(item.dataValues.count);
    });

    res.json({
      success: true,
      data: {
        totalTasks,
        completedTasks: completedCount,
        overdueTasks: overdueCount,
        statusBreakdown: statusStats,
        priorityBreakdown: priorityStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task statistics',
      error: error.message
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
  getTaskStats
};
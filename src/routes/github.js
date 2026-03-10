const express = require('express');
const router = express.Router();
const {
    syncGitHubIssues,
    getKanbanWithGitHubIssues,
    updateTaskStatus,
    getGitHubHealth,
    getRepositories,
    reconnectGitHub
} = require('../controllers/githubController');

/**
 * GitHub Integration Routes
 * Base path: /api/v1/github
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     GitHubTask:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Task title from GitHub issue
 *         description:
 *           type: string
 *           description: Truncated issue description
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *           description: Priority mapped from GitHub labels
 *         status:
 *           type: string
 *           enum: [Pending, In Progress, Completed]
 *           description: Status mapped from GitHub issue state
 *         githubId:
 *           type: number
 *           description: GitHub issue ID
 *         githubNumber:
 *           type: number
 *           description: GitHub issue number
 *         githubUrl:
 *           type: string
 *           description: GitHub issue URL
 *         githubRepository:
 *           type: string
 *           description: Repository in format "owner/repo"
 *         githubAssignee:
 *           type: string
 *           description: GitHub issue assignee username
 *         githubAuthor:
 *           type: string
 *           description: GitHub issue author username
 *         githubLabels:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of GitHub labels
 *         isGitHubIssue:
 *           type: boolean
 *           description: Flag indicating this is a GitHub issue
 *         source:
 *           type: string
 *           enum: [github, local]
 *           description: Source of the task
 */

/**
 * @swagger
 * /api/v1/github/sync:
 *   get:
 *     summary: Sync GitHub issues to tasks
 *     tags: [GitHub Integration]
 *     parameters:
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [open, closed, all]
 *         description: GitHub issue state to sync
 *         default: open
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [assigned, created, mentioned, subscribed, all]
 *         description: Filter type for user issues
 *         default: assigned
 *       - in: query
 *         name: autoSave
 *         schema:
 *           type: boolean
 *         description: Automatically save synced issues as tasks
 *         default: false
 *     responses:
 *       200:
 *         description: Issues synced successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     issues:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/GitHubTask'
 *                     saved:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/GitHubTask'
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         high_priority:
 *                           type: number
 *                         medium_priority:
 *                           type: number
 *                         low_priority:
 *                           type: number
 *                         repositories:
 *                           type: array
 *                           items:
 *                             type: string
 *                         auto_saved:
 *                           type: number
 *       500:
 *         description: Error syncing GitHub issues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.get('/sync', syncGitHubIssues);

/**
 * @swagger
 * /api/v1/github/kanban:
 *   get:
 *     summary: Get Kanban board with GitHub issues
 *     tags: [GitHub Integration]
 *     parameters:
 *       - in: query
 *         name: includeLocal
 *         schema:
 *           type: boolean
 *         description: Include local tasks in the board
 *         default: true
 *       - in: query
 *         name: githubFilter
 *         schema:
 *           type: string
 *           enum: [assigned, created, mentioned, subscribed, all]
 *         description: Filter for GitHub issues
 *         default: assigned
 *     responses:
 *       200:
 *         description: Kanban board loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     board:
 *                       type: object
 *                       properties:
 *                         pending:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/GitHubTask'
 *                         in-progress:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/GitHubTask'
 *                         completed:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/GitHubTask'
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         total_tasks:
 *                           type: number
 *                         github_issues:
 *                           type: number
 *                         local_tasks:
 *                           type: number
 *                         by_status:
 *                           type: object
 *                         by_priority:
 *                           type: object
 *                         github_repositories:
 *                           type: array
 *                           items:
 *                             type: string
 */
router.get('/kanban', getKanbanWithGitHubIssues);

/**
 * @swagger
 * /api/v1/github/tasks/{id}/status:
 *   put:
 *     summary: Update task status and sync to GitHub
 *     tags: [GitHub Integration]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, In Progress, Completed]
 *                 description: New task status
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/GitHubTask'
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Task not found
 */
router.put('/tasks/:id/status', updateTaskStatus);

/**
 * @swagger
 * /api/v1/github/health:
 *   get:
 *     summary: Check GitHub MCP connection health
 *     tags: [GitHub Integration]
 *     responses:
 *       200:
 *         description: Health check successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     connected:
 *                       type: boolean
 *                     service:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     status:
 *                       type: string
 *                       enum: [healthy, disconnected, error]
 *       503:
 *         description: GitHub service unavailable
 */
router.get('/health', getGitHubHealth);

/**
 * @swagger
 * /api/v1/github/repositories:
 *   get:
 *     summary: Get GitHub repositories information
 *     tags: [GitHub Integration]
 *     responses:
 *       200:
 *         description: Repositories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     repositories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           language:
 *                             type: string
 *                           stars:
 *                             type: number
 *                           url:
 *                             type: string
 *                           issues_count:
 *                             type: number
 *                     total_count:
 *                       type: number
 *                     total_issues:
 *                       type: number
 */
router.get('/repositories', getRepositories);

/**
 * @swagger
 * /api/v1/github/reconnect:
 *   post:
 *     summary: Force reconnect to GitHub MCP server
 *     tags: [GitHub Integration]
 *     responses:
 *       200:
 *         description: Reconnected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     status:
 *                       type: string
 *       500:
 *         description: Failed to reconnect
 */
router.post('/reconnect', reconnectGitHub);

module.exports = router;
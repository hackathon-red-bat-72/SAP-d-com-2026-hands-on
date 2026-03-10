const GitHubMcpService = require('../services/githubMcpService');
const Task = require('../models/Task');

// Initialize GitHub MCP service
const githubService = new GitHubMcpService();

/**
 * GitHub Integration Controller
 * Handles GitHub issues synchronization with Task Manager
 */

/**
 * Sync GitHub issues to tasks
 * GET /api/v1/github/sync
 */
const syncGitHubIssues = async (req, res) => {
    try {
        const { 
            state = 'open', 
            filter = 'assigned',
            autoSave = false 
        } = req.query;

        console.log(`🔄 Syncing GitHub issues - State: ${state}, Filter: ${filter}`);

        // Fetch and convert GitHub issues to tasks
        const githubTasks = await githubService.syncIssuesToTasks({ state, filter });

        let savedTasks = [];
        
        if (autoSave === 'true') {
            // Save GitHub tasks to database (avoiding duplicates)
            for (const githubTask of githubTasks) {
                try {
                    // Check if task already exists
                    const existingTask = await Task.findOne({ 
                        githubId: githubTask.githubId 
                    });

                    if (existingTask) {
                        // Update existing task
                        Object.assign(existingTask, githubTask);
                        const updatedTask = await existingTask.save();
                        savedTasks.push(updatedTask);
                        console.log(`✅ Updated existing task for GitHub issue #${githubTask.githubNumber}`);
                    } else {
                        // Create new task
                        const newTask = new Task(githubTask);
                        const savedTask = await newTask.save();
                        savedTasks.push(savedTask);
                        console.log(`✅ Created new task for GitHub issue #${githubTask.githubNumber}`);
                    }
                } catch (error) {
                    console.error(`❌ Error saving task for GitHub issue #${githubTask.githubNumber}:`, error);
                }
            }
        }

        res.status(200).json({
            success: true,
            message: `Successfully synced ${githubTasks.length} GitHub issues`,
            data: {
                issues: githubTasks,
                saved: autoSave === 'true' ? savedTasks : [],
                summary: {
                    total: githubTasks.length,
                    high_priority: githubTasks.filter(task => task.priority === 'High').length,
                    medium_priority: githubTasks.filter(task => task.priority === 'Medium').length,
                    low_priority: githubTasks.filter(task => task.priority === 'Low').length,
                    repositories: [...new Set(githubTasks.map(task => task.githubRepository))],
                    auto_saved: autoSave === 'true' ? savedTasks.length : 0
                }
            }
        });

    } catch (error) {
        console.error('❌ Error syncing GitHub issues:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to sync GitHub issues',
            error: error.message
        });
    }
};

/**
 * Get Kanban board with GitHub issues
 * GET /api/v1/github/kanban
 */
const getKanbanWithGitHubIssues = async (req, res) => {
    try {
        const { includeLocal = 'true', githubFilter = 'assigned' } = req.query;

        console.log('📋 Fetching Kanban board with GitHub issues...');

        // Fetch GitHub issues
        const githubTasks = await githubService.syncIssuesToTasks({ 
            state: 'open', 
            filter: githubFilter 
        });

        let localTasks = [];
        if (includeLocal === 'true') {
            // Fetch local tasks (excluding GitHub synced tasks to avoid duplicates)
            localTasks = await Task.find({ 
                $or: [
                    { isGitHubIssue: { $ne: true } },
                    { isGitHubIssue: { $exists: false } }
                ]
            }).sort({ updatedAt: -1 });
        }

        // Combine and organize tasks by status for Kanban board
        const allTasks = [...githubTasks, ...localTasks];
        
        const kanbanBoard = {
            pending: allTasks.filter(task => task.status === 'Pending'),
            'in-progress': allTasks.filter(task => task.status === 'In Progress'),
            completed: allTasks.filter(task => task.status === 'Completed')
        };

        res.status(200).json({
            success: true,
            message: 'Kanban board loaded with GitHub issues',
            data: {
                board: kanbanBoard,
                statistics: {
                    total_tasks: allTasks.length,
                    github_issues: githubTasks.length,
                    local_tasks: localTasks.length,
                    by_status: {
                        pending: kanbanBoard.pending.length,
                        in_progress: kanbanBoard['in-progress'].length,
                        completed: kanbanBoard.completed.length
                    },
                    by_priority: {
                        high: allTasks.filter(task => task.priority === 'High').length,
                        medium: allTasks.filter(task => task.priority === 'Medium').length,
                        low: allTasks.filter(task => task.priority === 'Low').length
                    },
                    github_repositories: [...new Set(githubTasks.map(task => task.githubRepository))]
                }
            }
        });

    } catch (error) {
        console.error('❌ Error loading Kanban board:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load Kanban board with GitHub issues',
            error: error.message
        });
    }
};

/**
 * Update task status and sync to GitHub if needed
 * PUT /api/v1/github/tasks/:id/status
 */
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['Pending', 'In Progress', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: Pending, In Progress, or Completed'
            });
        }

        // Find task
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Update task status
        task.status = status;
        const updatedTask = await task.save();

        // If this is a GitHub issue, sync the status back to GitHub
        if (task.isGitHubIssue && task.githubNumber) {
            try {
                await githubService.updateGitHubIssueStatus(task, status);
                console.log(`✅ Synced status change to GitHub issue #${task.githubNumber}`);
            } catch (error) {
                console.warn('⚠️ Could not sync status to GitHub:', error.message);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Task status updated successfully',
            data: updatedTask
        });

    } catch (error) {
        console.error('❌ Error updating task status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update task status',
            error: error.message
        });
    }
};

/**
 * Get GitHub connection health status
 * GET /api/v1/github/health
 */
const getGitHubHealth = async (req, res) => {
    try {
        const isHealthy = await githubService.healthCheck();
        
        res.status(200).json({
            success: true,
            data: {
                connected: isHealthy,
                service: 'GitHub MCP Server',
                timestamp: new Date().toISOString(),
                status: isHealthy ? 'healthy' : 'disconnected'
            }
        });

    } catch (error) {
        console.error('❌ GitHub health check failed:', error);
        res.status(503).json({
            success: false,
            message: 'GitHub service unavailable',
            data: {
                connected: false,
                service: 'GitHub MCP Server',
                timestamp: new Date().toISOString(),
                status: 'error',
                error: error.message
            }
        });
    }
};

/**
 * Get GitHub repositories information
 * GET /api/v1/github/repositories
 */
const getRepositories = async (req, res) => {
    try {
        // Get unique repositories from current GitHub tasks
        const githubTasks = await githubService.syncIssuesToTasks({ 
            state: 'open', 
            filter: 'assigned' 
        });

        const repositories = [...new Set(githubTasks.map(task => task.githubRepository))]
            .filter(repo => repo && repo !== 'Unknown Repository');

        const repositoryDetails = [];

        for (const repo of repositories) {
            try {
                const repoInfo = await githubService.getRepositoryInfo(`https://github.com/${repo}`);
                if (repoInfo) {
                    repositoryDetails.push({
                        name: repo,
                        description: repoInfo.description,
                        language: repoInfo.language,
                        stars: repoInfo.stargazers_count,
                        url: repoInfo.html_url,
                        issues_count: githubTasks.filter(task => task.githubRepository === repo).length
                    });
                }
            } catch (error) {
                console.warn(`⚠️ Could not fetch details for repository ${repo}:`, error.message);
                repositoryDetails.push({
                    name: repo,
                    description: 'No description available',
                    language: 'Unknown',
                    stars: 0,
                    url: `https://github.com/${repo}`,
                    issues_count: githubTasks.filter(task => task.githubRepository === repo).length
                });
            }
        }

        res.status(200).json({
            success: true,
            message: `Found ${repositories.length} repositories with open issues`,
            data: {
                repositories: repositoryDetails,
                total_count: repositories.length,
                total_issues: githubTasks.length
            }
        });

    } catch (error) {
        console.error('❌ Error fetching repositories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch repository information',
            error: error.message
        });
    }
};

/**
 * Force reconnect to GitHub MCP server
 * POST /api/v1/github/reconnect
 */
const reconnectGitHub = async (req, res) => {
    try {
        await githubService.disconnect();
        await githubService.connect();

        res.status(200).json({
            success: true,
            message: 'Successfully reconnected to GitHub MCP server',
            data: {
                timestamp: new Date().toISOString(),
                status: 'connected'
            }
        });

    } catch (error) {
        console.error('❌ Error reconnecting to GitHub:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reconnect to GitHub MCP server',
            error: error.message
        });
    }
};

module.exports = {
    syncGitHubIssues,
    getKanbanWithGitHubIssues,
    updateTaskStatus,
    getGitHubHealth,
    getRepositories,
    reconnectGitHub
};
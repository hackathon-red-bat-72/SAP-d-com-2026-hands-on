const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

/**
 * GitHub MCP Service for integrating GitHub issues with Task Manager
 * Fetches GitHub issues and converts them to tasks for the Kanban board
 */
class GitHubMcpService {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    /**
     * Initialize MCP connection to GitHub server
     */
    async connect() {
        try {
            const transport = new StdioClientTransport({
                command: 'npx',
                args: ['-y', '@modelcontextprotocol/server-github'],
                env: {
                    GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
                }
            });

            this.client = new Client({
                name: 'task-manager-github-integration',
                version: '1.0.0'
            }, {
                capabilities: {
                    tools: {}
                }
            });

            await this.client.connect(transport);
            this.isConnected = true;
            console.log('✅ Connected to GitHub MCP server');
        } catch (error) {
            console.error('❌ Failed to connect to GitHub MCP server:', error);
            throw error;
        }
    }

    /**
     * Disconnect from MCP server
     */
    async disconnect() {
        if (this.client && this.isConnected) {
            await this.client.close();
            this.isConnected = false;
            console.log('🔌 Disconnected from GitHub MCP server');
        }
    }

    /**
     * Fetch GitHub issues for the authenticated user
     * @param {Object} options - Filtering options
     * @param {string} options.state - Issue state ('open', 'closed', 'all')
     * @param {string} options.filter - Filter type ('assigned', 'created', 'mentioned', 'subscribed', 'all')
     * @returns {Array} Array of GitHub issues
     */
    async fetchUserIssues(options = {}) {
        if (!this.isConnected) {
            await this.connect();
        }

        try {
            const { state = 'open', filter = 'assigned' } = options;
            
            // Use MCP tools to search for issues involving the user
            const searchQuery = this.buildIssueSearchQuery(filter, state);
            
            const response = await this.client.request({
                method: 'tools/call',
                params: {
                    name: 'search_issues',
                    arguments: {
                        query: searchQuery,
                        sort: 'updated',
                        order: 'desc',
                        per_page: 50
                    }
                }
            });

            return response.result?.content?.[0]?.text ? 
                JSON.parse(response.result.content[0].text).items || [] : [];
        } catch (error) {
            console.error('❌ Error fetching GitHub issues:', error);
            return [];
        }
    }

    /**
     * Build GitHub search query based on filter type
     * @param {string} filter - Filter type
     * @param {string} state - Issue state
     * @returns {string} GitHub search query
     */
    buildIssueSearchQuery(filter, state) {
        const username = process.env.GITHUB_USERNAME || 'I308645';
        let query = `is:issue is:${state}`;

        switch (filter) {
            case 'assigned':
                query += ` assignee:${username}`;
                break;
            case 'created':
                query += ` author:${username}`;
                break;
            case 'mentioned':
                query += ` mentions:${username}`;
                break;
            case 'subscribed':
                query += ` involves:${username}`;
                break;
            case 'all':
                query += ` involves:${username}`;
                break;
        }

        return query;
    }

    /**
     * Convert GitHub issue to Task Manager task format
     * @param {Object} issue - GitHub issue object
     * @returns {Object} Task object compatible with Task Manager
     */
    convertIssueToTask(issue) {
        return {
            title: issue.title,
            description: this.truncateDescription(issue.body || 'No description provided'),
            priority: this.mapGitHubLabelsToPriority(issue.labels),
            status: this.mapGitHubStateToStatus(issue.state),
            dueDate: this.extractDueDateFromIssue(issue),
            githubId: issue.id,
            githubNumber: issue.number,
            githubUrl: issue.html_url,
            githubRepository: issue.repository_url ? 
                issue.repository_url.split('/').slice(-2).join('/') : 
                'Unknown Repository',
            githubAssignee: issue.assignee?.login,
            githubAuthor: issue.user?.login,
            githubLabels: issue.labels?.map(label => label.name) || [],
            createdAt: new Date(issue.created_at),
            updatedAt: new Date(issue.updated_at),
            isGitHubIssue: true,
            source: 'github'
        };
    }

    /**
     * Map GitHub labels to Task Manager priority
     * @param {Array} labels - GitHub issue labels
     * @returns {string} Priority level
     */
    mapGitHubLabelsToPriority(labels = []) {
        const priorityLabels = labels.map(label => 
            typeof label === 'string' ? label.toLowerCase() : label.name?.toLowerCase()
        );

        if (priorityLabels.some(label => 
            label.includes('high') || 
            label.includes('urgent') || 
            label.includes('critical') ||
            label.includes('p1')
        )) {
            return 'High';
        }

        if (priorityLabels.some(label => 
            label.includes('medium') || 
            label.includes('normal') ||
            label.includes('p2')
        )) {
            return 'Medium';
        }

        return 'Low';
    }

    /**
     * Map GitHub issue state to Task Manager status
     * @param {string} state - GitHub issue state
     * @returns {string} Task status
     */
    mapGitHubStateToStatus(state) {
        switch (state?.toLowerCase()) {
            case 'open':
                return 'Pending';
            case 'closed':
                return 'Completed';
            default:
                return 'Pending';
        }
    }

    /**
     * Extract due date from issue (if specified in body or labels)
     * @param {Object} issue - GitHub issue
     * @returns {Date|null} Due date or null
     */
    extractDueDateFromIssue(issue) {
        try {
            // Check for due date in issue body
            const bodyText = issue.body || '';
            const dueDateMatch = bodyText.match(/due:\s*(\d{4}-\d{2}-\d{2})/i);
            
            if (dueDateMatch) {
                return new Date(dueDateMatch[1]);
            }

            // Check for due date in labels
            const dueDateLabel = issue.labels?.find(label => 
                (typeof label === 'string' ? label : label.name)
                    ?.toLowerCase().includes('due:')
            );

            if (dueDateLabel) {
                const labelName = typeof dueDateLabel === 'string' ? 
                    dueDateLabel : dueDateLabel.name;
                const dateMatch = labelName.match(/due:(\d{4}-\d{2}-\d{2})/i);
                if (dateMatch) {
                    return new Date(dateMatch[1]);
                }
            }

            return null;
        } catch (error) {
            console.warn('⚠️ Error extracting due date from issue:', error);
            return null;
        }
    }

    /**
     * Truncate issue description to fit task format
     * @param {string} description - Full issue description
     * @returns {string} Truncated description
     */
    truncateDescription(description) {
        const maxLength = 500;
        if (description.length <= maxLength) {
            return description;
        }
        return description.substring(0, maxLength - 3) + '...';
    }

    /**
     * Sync GitHub issues to Task Manager
     * @param {Object} options - Sync options
     * @returns {Array} Array of converted tasks
     */
    async syncIssuesToTasks(options = {}) {
        try {
            console.log('🔄 Starting GitHub issues sync...');
            
            const issues = await this.fetchUserIssues(options);
            const tasks = issues.map(issue => this.convertIssueToTask(issue));

            console.log(`✅ Synchronized ${tasks.length} GitHub issues to tasks`);
            return tasks;
        } catch (error) {
            console.error('❌ Error syncing GitHub issues:', error);
            throw error;
        }
    }

    /**
     * Get repository information for a GitHub URL
     * @param {string} url - GitHub repository URL
     * @returns {Object} Repository info
     */
    async getRepositoryInfo(url) {
        try {
            const urlParts = url.split('/');
            const owner = urlParts[urlParts.length - 2];
            const repo = urlParts[urlParts.length - 1];

            const response = await this.client.request({
                method: 'tools/call',
                params: {
                    name: 'get_repository',
                    arguments: { owner, repo }
                }
            });

            return response.result?.content?.[0]?.text ? 
                JSON.parse(response.result.content[0].text) : null;
        } catch (error) {
            console.warn('⚠️ Could not fetch repository info:', error);
            return null;
        }
    }

    /**
     * Update GitHub issue status when task status changes
     * @param {Object} task - Task object with GitHub info
     * @param {string} newStatus - New task status
     */
    async updateGitHubIssueStatus(task, newStatus) {
        if (!task.isGitHubIssue || !task.githubNumber) {
            return;
        }

        try {
            const [owner, repo] = task.githubRepository.split('/');
            const issueState = newStatus === 'Completed' ? 'closed' : 'open';

            await this.client.request({
                method: 'tools/call',
                params: {
                    name: 'update_issue',
                    arguments: {
                        owner,
                        repo,
                        issue_number: task.githubNumber,
                        state: issueState
                    }
                }
            });

            console.log(`✅ Updated GitHub issue #${task.githubNumber} status to: ${issueState}`);
        } catch (error) {
            console.error('❌ Error updating GitHub issue status:', error);
        }
    }

    /**
     * Health check for GitHub MCP connection
     * @returns {boolean} Connection status
     */
    async healthCheck() {
        try {
            if (!this.isConnected) {
                await this.connect();
            }

            // Test connection by fetching user info
            await this.client.request({
                method: 'tools/call',
                params: {
                    name: 'get_authenticated_user',
                    arguments: {}
                }
            });

            return true;
        } catch (error) {
            console.error('❌ GitHub MCP health check failed:', error);
            return false;
        }
    }
}

module.exports = GitHubMcpService;
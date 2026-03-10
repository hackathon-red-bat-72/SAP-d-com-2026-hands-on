# GitHub Issues Integration with Task Manager

## 🎯 Overview

This integration allows you to synchronize your GitHub issues with the Task Manager application, creating a unified Kanban board that displays both local tasks and GitHub issues. You can manage your GitHub issues directly from the Task Manager interface with bi-directional synchronization.

## ✨ Features

- **📋 GitHub Issue Sync**: Automatically fetch and convert GitHub issues to tasks
- **🔄 Bi-directional Sync**: Update task status and sync back to GitHub
- **📊 Kanban Board**: Visual task management with GitHub issues
- **🏷️ Smart Priority Mapping**: Automatic priority assignment from GitHub labels
- **🔍 Advanced Filtering**: Filter by repository, assignee, labels, etc.
- **📈 Real-time Statistics**: Live dashboard with repository and task metrics
- **🎨 Interactive UI**: Drag-and-drop task management
- **🔗 GitHub Integration**: Direct links to GitHub issues

## 🚀 Your Current Issue

I found **1 open GitHub issue** that involves you:

### 📋 Issue #3: "I308645 Content Feature"
- **Repository**: `GitHubCopilotConferenceBlr-Hands-On/GitHub-Copilot-Hands-on`
- **Priority**: Medium (based on `feature`, `enhancement` labels)
- **Labels**: `enhancement`, `feature`, `backend`, `api`, `content-management`
- **Status**: Open → Will become "Pending" task
- **URL**: https://github.tools.sap/GitHubCopilotConferenceBlr-Hands-On/GitHub-Copilot-Hands-on/issues/3

This comprehensive content management feature will be added as a high-priority task in your Kanban board!

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB running
- GitHub Personal Access Token
- Task Manager API running

### 1. Environment Configuration

Add to your `.env` file:
```env
# GitHub Integration
GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
GITHUB_USERNAME=I308645

# MongoDB (if not already configured)
MONGODB_URI=mongodb://localhost:27017/taskmanager
```

### 2. Install Dependencies

The GitHub MCP integration uses:
```bash
npm install @modelcontextprotocol/sdk axios
```

### 3. Start the Enhanced Server

The GitHub integration is included in your branch. Start the server:
```bash
# Start with GitHub integration
npm run dev

# Or start test server (Swagger only)
npm run test-server
```

## 📱 Quick Start - Sync Your Issues Now!

### Option 1: Use the Sync Script (Recommended)

```bash
# Navigate to your project directory
cd "/path/to/project"

# Run the immediate sync script
node sync-my-issues.js
```

This will create a task from your "Content Feature" issue immediately!

### Option 2: Use the API Endpoints

```bash
# Sync GitHub issues to tasks
curl "http://localhost:3000/api/v1/github/sync?autoSave=true"

# Get Kanban board with GitHub issues
curl "http://localhost:3000/api/v1/github/kanban"
```

### Option 3: Use the Web Interface

1. Open the Kanban Board: http://localhost:3000/public/github-kanban.html
2. Click "Sync GitHub Issues" button
3. View your issues as tasks in the board

## 📊 API Endpoints

### GitHub Integration Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/github/sync` | Sync GitHub issues to tasks |
| `GET` | `/api/v1/github/kanban` | Get Kanban board with GitHub issues |
| `PUT` | `/api/v1/github/tasks/:id/status` | Update task status (syncs to GitHub) |
| `GET` | `/api/v1/github/health` | Check GitHub MCP connection |
| `GET` | `/api/v1/github/repositories` | Get repository information |
| `POST` | `/api/v1/github/reconnect` | Reconnect to GitHub MCP |

### Sync Parameters

```bash
# Sync with parameters
GET /api/v1/github/sync?state=open&filter=assigned&autoSave=true

# Parameters:
# - state: open, closed, all
# - filter: assigned, created, mentioned, all
# - autoSave: true/false (save to database)
```

### Kanban Board Parameters

```bash
# Get Kanban board
GET /api/v1/github/kanban?includeLocal=true&githubFilter=assigned

# Parameters:
# - includeLocal: true/false (include local tasks)
# - githubFilter: assigned, created, mentioned, all
```

## 🎨 Web Interface

### GitHub Kanban Board

Access the interactive Kanban board at: **http://localhost:3000/public/github-kanban.html**

Features:
- **📊 Live Statistics**: Total tasks, GitHub issues, priorities
- **🔄 Real-time Sync**: Auto-refresh every 30 seconds  
- **🖱️ Drag & Drop**: Move tasks between columns
- **🔍 Filtering**: By assignee, repository, status
- **🏷️ Visual Labels**: Priority and GitHub badges
- **🔗 Direct Links**: Click to open GitHub issues
- **📱 Responsive**: Works on desktop and mobile

### Task Card Information

Each GitHub issue displays:
- **Title and Description**: Truncated to fit
- **Priority Badge**: High/Medium/Low (from labels)
- **GitHub Badge**: Issue number (#3)
- **Repository Badge**: Repository name
- **Labels**: All GitHub labels
- **Direct Link**: "View on GitHub" button

## 🔄 Bi-directional Synchronization

### Task Status → GitHub Issue State

| Task Status | GitHub State | Action |
|-------------|--------------|---------|
| Pending | Open | Issue remains open |
| In Progress | Open | Issue remains open |
| Completed | Closed | Issue gets closed |

### GitHub Priority Mapping

GitHub labels are automatically mapped to Task Manager priorities:

| GitHub Labels | Task Priority |
|---------------|---------------|
| `high`, `urgent`, `critical`, `p0`, `p1`, `bug`, `security` | **High** |
| `medium`, `normal`, `p2`, `feature`, `enhancement` | **Medium** |
| `low`, `minor`, `p3`, `documentation` | **Low** |

Your "Content Feature" issue has `feature` and `enhancement` labels → **Medium Priority**

## 📈 Statistics Dashboard

The Kanban board shows real-time statistics:
- **Total Tasks**: Local + GitHub issues
- **GitHub Issues**: Synced from repositories
- **Local Tasks**: Created directly in Task Manager
- **Priority Breakdown**: High/Medium/Low counts
- **Status Distribution**: Pending/In Progress/Completed
- **Repository List**: Active repositories with issue counts

## 🔧 Advanced Usage

### Custom Priority Mapping

Edit `src/services/githubMcpService.js` to customize priority mapping:

```javascript
mapGitHubLabelsToPriority(labels = []) {
    const priorityLabels = labels.map(label => label.toLowerCase());
    
    // Add your custom priority logic
    if (priorityLabels.includes('your-high-priority-label')) {
        return 'High';
    }
    
    // Default mapping...
}
```

### Automated Sync

Set up automatic synchronization:

```bash
# Add to crontab for hourly sync
0 * * * * cd /path/to/project && node scripts/sync-my-issues.js
```

### Webhook Integration

For real-time updates, set up GitHub webhooks:

```javascript
// Add to your express app
app.post('/webhook/github', (req, res) => {
    const { action, issue } = req.body;
    
    if (action === 'opened' || action === 'edited') {
        // Sync this specific issue
        syncSingleIssue(issue);
    }
    
    res.status(200).send('OK');
});
```

## 🐛 Troubleshooting

### Common Issues

#### 1. GitHub Connection Failed
```bash
# Check GitHub health
curl http://localhost:3000/api/v1/github/health

# Solution: Verify token and permissions
echo $GITHUB_PERSONAL_ACCESS_TOKEN
```

#### 2. No Issues Found
- Verify you have open issues assigned to or mentioning you
- Check repository access permissions
- Try different filter options (`created`, `mentioned`, `all`)

#### 3. Sync Errors
```bash
# Check API logs
tail -f logs/app.log

# Reconnect to GitHub
curl -X POST http://localhost:3000/api/v1/github/reconnect
```

#### 4. Database Connection
```bash
# Check MongoDB connection
mongo taskmanager --eval "db.tasks.count()"

# Restart MongoDB if needed
brew services restart mongodb-community
```

### Debug Mode

Enable debug logging:
```bash
DEBUG=github:* npm run dev
```

### Health Checks

Monitor integration health:
```bash
# GitHub MCP Health
curl http://localhost:3000/api/v1/github/health

# Repository Information
curl http://localhost:3000/api/v1/github/repositories
```

## 📊 Sample API Responses

### Sync Response
```json
{
  "success": true,
  "message": "Successfully synced 1 GitHub issues",
  "data": {
    "issues": [
      {
        "title": "I308645 Content Feature",
        "priority": "Medium",
        "status": "Pending",
        "githubNumber": 3,
        "githubRepository": "GitHubCopilotConferenceBlr-Hands-On/GitHub-Copilot-Hands-on",
        "githubLabels": ["enhancement", "feature", "backend", "api"],
        "isGitHubIssue": true
      }
    ],
    "summary": {
      "total": 1,
      "high_priority": 0,
      "medium_priority": 1,
      "low_priority": 0,
      "repositories": ["GitHubCopilotConferenceBlr-Hands-On/GitHub-Copilot-Hands-on"]
    }
  }
}
```

### Kanban Response
```json
{
  "success": true,
  "data": {
    "board": {
      "pending": [
        {
          "title": "I308645 Content Feature",
          "description": "Enhanced Content Management System...",
          "priority": "Medium",
          "status": "Pending",
          "githubUrl": "https://github.tools.sap/.../issues/3",
          "isGitHubIssue": true
        }
      ],
      "in-progress": [],
      "completed": []
    },
    "statistics": {
      "total_tasks": 1,
      "github_issues": 1,
      "local_tasks": 0,
      "by_priority": { "high": 0, "medium": 1, "low": 0 }
    }
  }
}
```

## 🎯 Next Steps

1. **Run the Sync**: Execute `node sync-my-issues.js` to add your issue as a task
2. **Open Kanban Board**: Visit http://localhost:3000/public/github-kanban.html
3. **Manage Tasks**: Drag your issue between Pending → In Progress → Completed
4. **Watch GitHub Sync**: When you mark as Completed, the GitHub issue will be closed
5. **Explore API**: Use Swagger UI at http://localhost:3000/api-docs

## 🤝 Integration Benefits

- **Unified Workflow**: Manage GitHub issues alongside local tasks
- **Visual Management**: Kanban board for all your work items
- **Priority Tracking**: Automatic priority assignment from labels
- **Bi-directional Sync**: Changes flow both ways between GitHub and Task Manager
- **Team Collaboration**: Share Kanban board with team members
- **Progress Tracking**: Visual progress from idea to completion

## 📚 Additional Resources

- **GitHub MCP Documentation**: https://modelcontextprotocol.io/
- **GitHub Issues API**: https://docs.github.com/en/rest/issues
- **Task Manager API**: Check Swagger UI at `/api-docs`
- **MongoDB Documentation**: https://docs.mongodb.com/

---

**Ready to sync your GitHub issues? Run the sync script and start managing your work in the unified Kanban board!** 🚀

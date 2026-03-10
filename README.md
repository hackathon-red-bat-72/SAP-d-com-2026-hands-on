# Task Manager Backend API

**SAP GitHub Copilot 2025 Hands-On Session**

A robust Node.js/Express backend API for managing tasks with priorities, due dates, and filtering capabilities. This project serves as a comprehensive example for the GitHub Copilot Conference hands-on workshop.

## Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete tasks
- 🏷️ **Priority Management**: High, Medium, Low priorities
- 📅 **Due Date Tracking**: Set and track task deadlines
- 🔍 **Advanced Filtering**: Filter by status, priority, due date, search text
- 📊 **Task Statistics**: Get overview of task counts by status and priority
- ⚡ **Performance**: Indexed database queries for fast responses
- 🔒 **Validation**: Comprehensive input validation and error handling
- 📖 **Pagination**: Efficient data retrieval with pagination

## 🎯 Workshop Learning Objectives

This hands-on session demonstrates:

- **GitHub Copilot Integration**: Experience AI-powered coding assistance
- **MCP Server Setup**: Learn Model Context Protocol implementation
- **API Development**: Build REST APIs with Express.js and PostgreSQL
- **Documentation-First**: Interactive Swagger/OpenAPI documentation
- **Best Practices**: Code organization, error handling, and validation
- **Development Workflows**: From prototype to production-ready API

## Tech Stack

- **Runtime**: Node.js (v14+)
- **Framework**: Express.js (v4.18.2)
- **Database**: PostgreSQL with Sequelize ORM (v6.35.1)
- **Validation**: Express Validator (v7.0.1)
- **Security**: Helmet (v7.0.0), CORS (v2.8.5)
- **Documentation**: Swagger/OpenAPI 3.0
- **Development**: Nodemon (v3.0.1)
- **GitHub Integration**: MCP (Model Context Protocol) Server
- **Logging**: Morgan (v1.10.0)

## 🚀 Quick Start for Workshop Participants

**For GitHub Copilot Conference attendees**, the fastest way to get started:

```bash
# 1. Clone the repository
git clone https://github.tools.sap/GitHubCopilotConferenceBlr-Hands-On/GitHub-Copilot-Hands-on.git
cd GitHub-Copilot-Hands-on

# 2. Install dependencies
npm install

# 3. Start the test server (no PostgreSQL required)
npm run test-server

# 4. Open your browser to view the API documentation
# http://localhost:3001/api-docs
```

⭐ **That's it!** You now have a fully functional API documentation to explore.

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm  
- PostgreSQL (local installation)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.tools.sap/GitHubCopilotConferenceBlr-Hands-On/GitHub-Copilot-Hands-on.git
   cd GitHub-Copilot-Hands-on
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # On Windows Command Prompt, use:
   copy env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   PG_HOST=localhost
   PG_PORT=5432
   PG_DB=taskmanager
   PG_USER=postgres
   PG_PASSWORD=postgres
   ```

4. **Set up PostgreSQL database**
   - Install PostgreSQL locally or use a cloud service
   - Create a database named `taskmanager`
   - Update the connection settings in your `.env` file

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Seed test data (optional)**
   ```bash
   node seed.js
   ```

### Environment Variables

Copy `env.example` to `.env` and configure:

```env
PORT=3000
NODE_ENV=development
PG_HOST=localhost
PG_PORT=5432
PG_DB=taskmanager
PG_USER=postgres
PG_PASSWORD=postgres
PG_HOST=localhost
PG_PORT=5432
```

## Health Check

Visit [http://localhost:3000/health](http://localhost:3000/health) to verify server and database status.

## API Endpoints

### 1. Get All Tasks
```http
GET /api/v1/tasks
```

**Query Parameters:**
- `status` - Filter by status (`Pending`, `In Progress`, `Completed`)
- `priority` - Filter by priority (`Low`, `Medium`, `High`)
- `search` - Search in title and description
- `overdue` - Show overdue tasks (`true`/`false`)
- `dueDateFrom` - Filter tasks due from this date (ISO format)
- `dueDateTo` - Filter tasks due until this date (ISO format)
- `sortBy` - Sort field (`createdAt`, `dueDate`, `priority`, `title`)
- `sortOrder` - Sort direction (`asc`, `desc`)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example:**
```bash
GET /api/v1/tasks?status=Pending&priority=High&page=1&limit=5
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Complete project documentation",
        "description": "Write comprehensive API documentation",
        "priority": "High",
        "status": "Pending",
        "dueDate": "2025-09-30T00:00:00.000Z",
        "createdAt": "2025-09-22T10:00:00.000Z",
        "updatedAt": "2025-09-22T10:00:00.000Z",
        "isOverdue": false,
        "daysUntilDue": 8
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalTasks": 15,
      "tasksPerPage": 5
    }
  }
}
```

### 2. Get Single Task
```http
GET /api/v1/tasks/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "priority": "High",
    "status": "Pending",
    "dueDate": "2025-09-30T00:00:00.000Z",
    "createdAt": "2025-09-22T10:00:00.000Z",
    "updatedAt": "2025-09-22T10:00:00.000Z"
  }
}
```

### 3. Create New Task
```http
POST /api/v1/tasks
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "High",
  "dueDate": "2025-09-30T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "priority": "High",
    "status": "Pending",
    "dueDate": "2025-09-30T00:00:00.000Z",
    "createdAt": "2025-09-22T10:00:00.000Z",
    "updatedAt": "2025-09-22T10:00:00.000Z"
  }
}
```

### 4. Update Task
```http
PUT /api/v1/tasks/:id
```

**Request Body:**
```json
{
  "status": "In Progress",
  "priority": "Medium"
}
```

### 5. Delete Task
```http
DELETE /api/v1/tasks/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "id": 1,
    "title": "Complete project documentation"
  }
}
```

### 6. Get Task Statistics
```http
GET /api/v1/tasks/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "pending": 10,
    "inProgress": 8,
    "completed": 7,
    "overdue": 3,
    "high": 5,
    "medium": 12,
    "low": 8
  }
}
```

### Task Model Schema

```javascript
{
  title: String (required, max 100 chars),
  description: String (optional, max 500 chars),
  priority: Enum ['Low', 'Medium', 'High'] (default: 'Medium'),
  status: Enum ['Pending', 'In Progress', 'Completed'] (default: 'Pending'),
  dueDate: Date (optional, must be future date),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

### Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Example Usage with cURL

### Create a task
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review code changes",
    "description": "Review pull request #123",
    "priority": "High",
    "dueDate": "2025-09-25T17:00:00.000Z"
  }'
```

### Get pending high-priority tasks
```bash
curl "http://localhost:3000/api/v1/tasks?status=Pending&priority=High&sortBy=dueDate&sortOrder=asc"
```

### Update task status
```bash
curl -X PUT http://localhost:3000/api/v1/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "Completed"}'
```

### Search tasks
```bash
curl "http://localhost:3000/api/v1/tasks?search=documentation"
```

## Development

### Project Structure
```
GitHubCopilot-Hands-on/
├── src/
│   ├── config/
│   │   └── postgres.js       # PostgreSQL connection
│   ├── controllers/
│   │   └── taskController.js # Business logic
│   ├── middleware/
│   │   └── validation.js     # Input validation
│   ├── models/
│   │   └── Task.js          # Sequelize Task model
│   └── routes/
│       └── tasks.js         # API routes
├── server.js                # Main application entry
├── package.json
└── README.md
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `PG_HOST` | PostgreSQL host | `localhost` |
| `PG_PORT` | PostgreSQL port | `5432` |
| `PG_DB` | PostgreSQL database name | `taskmanager` |
| `PG_USER` | PostgreSQL username | `postgres` |
| `PG_PASSWORD` | PostgreSQL password | `postgres` |

## Deployment

### Using PostgreSQL in Production

1. Set up a PostgreSQL database server (e.g., AWS RDS, Google Cloud SQL, Azure Database)
2. Get your connection details
3. Update PostgreSQL environment variables:
   ```env
   PG_HOST=your-postgres-host.com
   PG_PORT=5432
   PG_DB=taskmanager
   PG_USER=your_db_user
   PG_PASSWORD=your_secure_password
   ```

### Docker Deployment (Optional)

Create a `Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## 🔗 GitHub MCP Server Integration

### Overview

The Task Manager API supports integration with **GitHub MCP (Model Context Protocol) Server** for enhanced repository-based task management. This integration allows you to:

- 📋 **Sync GitHub Issues** with your tasks
- 🔄 **Bi-directional synchronization** between tasks and GitHub issues
- 🏷️ **Leverage GitHub labels** for task categorization
- 👥 **Team collaboration** through GitHub's native features
- 📊 **Repository insights** and project management

### Prerequisites

1. **GitHub Personal Access Token** with the following permissions:
   - `repo` - Full repository access
   - `issues` - Read/write access to issues
   - `pull_requests` - Read access to pull requests

2. **Node.js** version 16 or higher

3. **MCP Configuration** - The project includes a `mcp.json` file for GitHub MCP server setup

### Setup Instructions

#### 1. Generate GitHub Personal Access Token

1. Go to **GitHub Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token"**
3. Select the following scopes:
   ```
   ✅ repo (Full control of private repositories)
   ✅ read:user (Read user profile data)
   ✅ user:email (Access user email addresses)
   ```
4. Copy the generated token (save it securely)

#### 2. Configure Environment Variables

Add your GitHub token to the environment:

**Windows (PowerShell):**
```powershell
$env:GITHUB_PERSONAL_ACCESS_TOKEN="your_github_token_here"
```

**Linux/macOS:**
```bash
export GITHUB_PERSONAL_ACCESS_TOKEN="your_github_token_here"
```

**Or add to your `.env` file:**
```env
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here
```

#### 3. Install GitHub MCP Server

The GitHub MCP server will be installed automatically when first accessed via the `mcp.json` configuration:

```bash
npx @modelcontextprotocol/server-github
```

#### 4. MCP Configuration

The project includes a pre-configured `mcp.json` file:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": ""
      }
    }
  }
}
```

### Available GitHub MCP Capabilities

#### 📋 **Repository Management**
- List repositories
- Get repository details
- Access repository content
- Branch and commit information

#### 🎯 **Issue Management**
- Create, read, update GitHub issues
- Manage issue labels and milestones
- Assign issues to users
- Comment on issues

#### 🔍 **Search & Discovery**
- Search across repositories
- Find issues by various criteria
- Code search capabilities
- User and organization lookup

#### 📊 **Analytics & Insights**
- Repository statistics
- Issue tracking metrics
- Contributor information
- Activity timelines

### Integration Examples

#### Example 1: Create GitHub Issue from Task

```javascript
// Using the GitHub MCP server to create an issue
const issueData = {
  title: task.title,
  body: `${task.description}\n\n---\nCreated from Task Manager\nPriority: ${task.priority}`,
  labels: [`priority-${task.priority}`, 'task-manager']
};

// This would be handled through MCP protocol
// The GitHub MCP server provides tools for issue creation
```

#### Example 2: Sync Task Status with GitHub Issue

```javascript
// Monitor GitHub issue state changes
// Update corresponding task status automatically
// Maintain bi-directional synchronization
```

### Testing the Integration

1. **Start your Task Manager API:**
   ```bash
   npm run dev
   ```

2. **Test GitHub MCP connection:**
   ```bash
   # The MCP server will be accessible through the configured client
   # Test with your favorite MCP client (Claude Desktop, etc.)
   ```

3. **Verify GitHub access:**
   - Check if repositories are accessible
   - Test issue creation/reading
   - Validate token permissions

### Troubleshooting

#### Common Issues:

1. **Authentication Error:**
   ```
   Error: Bad credentials
   ```
   **Solution:** Verify your GitHub Personal Access Token and permissions.

2. **MCP Server Not Found:**
   ```
   Error: Command not found
   ```
   **Solution:** Ensure Node.js and npm are properly installed.

3. **Permission Denied:**
   ```
   Error: Resource not accessible
   ```
   **Solution:** Check token scopes and repository access permissions.

#### Debug Mode:

Enable debug logging by setting:
```bash
export DEBUG=mcp:*
```

### Official Documentation & Resources

#### 📚 **Model Context Protocol (MCP)**
- **Official MCP Documentation:** https://modelcontextprotocol.io/
- **MCP Specification:** https://spec.modelcontextprotocol.io/
- **MCP SDK for Node.js:** https://github.com/modelcontextprotocol/typescript-sdk

#### 🐙 **GitHub MCP Server**
- **GitHub MCP Server Repository:** https://github.com/modelcontextprotocol/servers/tree/main/src/github
- **Installation Guide:** https://github.com/modelcontextprotocol/servers/blob/main/src/github/README.md
- **API Reference:** https://github.com/modelcontextprotocol/servers/blob/main/src/github/src/index.ts

#### 🛠️ **GitHub API Documentation**
- **GitHub REST API:** https://docs.github.com/en/rest
- **GitHub Issues API:** https://docs.github.com/en/rest/issues
- **Authentication:** https://docs.github.com/en/rest/authentication
- **Personal Access Tokens:** https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

#### 🔧 **Development Resources**
- **GitHub Apps vs Personal Access Tokens:** https://docs.github.com/en/developers/apps/differences-between-github-apps-and-personal-access-tokens
- **Rate Limiting:** https://docs.github.com/en/rest/rate-limit
- **Best Practices:** https://docs.github.com/en/rest/guides/best-practices-for-integrators

#### 🎯 **MCP Client Examples**
- **Claude Desktop:** https://claude.ai/
- **MCP Client Libraries:** https://github.com/modelcontextprotocol
- **Community Examples:** https://github.com/modelcontextprotocol/awesome-mcp

### Security Considerations

⚠️ **Important Security Notes:**

1. **Token Security:**
   - Never commit tokens to version control
   - Use environment variables or secure secret management
   - Rotate tokens regularly

2. **Permissions:**
   - Follow the principle of least privilege
   - Only grant necessary scopes
   - Regularly audit token usage

3. **Network Security:**
   - Use HTTPS for all GitHub API calls
   - Validate all input data
   - Implement proper error handling

### Support & Community

- **MCP Community:** https://github.com/modelcontextprotocol/community
- **GitHub Support:** https://support.github.com/
- **Issues & Bug Reports:** Use the repository's issue tracker

---

## 🎨 Frontend Development Recommendations

### Overview

This Task Manager API is designed to work seamlessly with any frontend technology stack. Below are comprehensive recommendations for building user interfaces that integrate with the backend API.

### 🌐 **Option 1: Vanilla JavaScript (Beginner-Friendly)**

**Best for:** Learning, prototyping, simple applications

#### **Quick Start Template:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Manager</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-4">
        <h1>Task Manager</h1>
        
        <!-- Task Creation Form -->
        <div class="card mb-4">
            <div class="card-body">
                <h5 class="card-title">Create New Task</h5>
                <form id="taskForm">
                    <div class="mb-3">
                        <input type="text" class="form-control" id="title" placeholder="Task Title" required>
                    </div>
                    <div class="mb-3">
                        <textarea class="form-control" id="description" placeholder="Description"></textarea>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <select class="form-select" id="priority">
                                <option value="Low">Low Priority</option>
                                <option value="Medium" selected>Medium Priority</option>
                                <option value="High">High Priority</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <input type="date" class="form-control" id="dueDate">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary mt-3">Create Task</button>
                </form>
            </div>
        </div>
        
        <!-- Task List -->
        <div id="taskList"></div>
    </div>

    <script>
        const API_BASE = 'http://localhost:3000/api/v1';
        
        // Create task
        document.getElementById('taskForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const taskData = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                priority: document.getElementById('priority').value,
                dueDate: document.getElementById('dueDate').value
            };
            
            try {
                const response = await fetch(`${API_BASE}/tasks`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });
                const result = await response.json();
                if (result.success) {
                    loadTasks();
                    e.target.reset();
                }
            } catch (error) {
                console.error('Error creating task:', error);
            }
        });
        
        // Load and display tasks
        async function loadTasks() {
            try {
                const response = await fetch(`${API_BASE}/tasks`);
                const result = await response.json();
                const taskList = document.getElementById('taskList');
                
                taskList.innerHTML = result.data.tasks.map(task => `
                    <div class="card mb-2">
                        <div class="card-body">
                            <h5 class="card-title">${task.title}</h5>
                            <p class="card-text">${task.description}</p>
                            <span class="badge bg-${getPriorityColor(task.priority)}">${task.priority}</span>
                            <span class="badge bg-${getStatusColor(task.status)}">${task.status}</span>
                            <div class="mt-2">
                                <button onclick="updateTaskStatus('${task.id}')" class="btn btn-sm btn-success">Complete</button>
                                <button onclick="deleteTask('${task.id}')" class="btn btn-sm btn-danger">Delete</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        }
        
        // Utility functions
        function getPriorityColor(priority) {
            return { High: 'danger', Medium: 'warning', Low: 'info' }[priority] || 'secondary';
        }
        
        function getStatusColor(status) {
            return { Pending: 'secondary', 'In Progress': 'primary', Completed: 'success' }[status] || 'secondary';
        }
        
        // Load tasks on page load
        loadTasks();
    </script>
</body>
</html>
```

#### **Pros:**
- ✅ No build tools required
- ✅ Quick to set up and learn
- ✅ Direct browser compatibility
- ✅ Perfect for prototyping

#### **Cons:**
- ❌ Limited scalability
- ❌ No component reusability
- ❌ Manual DOM manipulation

---

### ⚛️ **Option 2: React.js (Recommended for Modern Apps)**

**Best for:** Scalable applications, component-based architecture, rich user interfaces

#### **Setup Instructions:**
```bash
# Create React app
npx create-react-app task-manager-frontend
cd task-manager-frontend

# Install additional dependencies
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled
npm start
```

#### **Example Component Structure:**
```jsx
// src/components/TaskManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1';

function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: ''
    });

    // Load tasks
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${API_BASE}/tasks`);
            setTasks(response.data.data.tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const createTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/tasks`, formData);
            setFormData({ title: '', description: '', priority: 'Medium', dueDate: '' });
            fetchTasks();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const updateTask = async (id, updates) => {
        try {
            await axios.put(`${API_BASE}/tasks/${id}`, updates);
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Task Manager</h1>
            
            {/* Task Form */}
            <form onSubmit={createTask} className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Task Title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="border rounded px-3 py-2"
                        required
                    />
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        className="border rounded px-3 py-2"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="border rounded px-3 py-2 w-full mt-4"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                    Create Task
                </button>
            </form>

            {/* Task List */}
            <div className="space-y-4">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} onUpdate={updateTask} />
                ))}
            </div>
        </div>
    );
}

// TaskCard Component
function TaskCard({ task, onUpdate }) {
    const getPriorityColor = (priority) => {
        const colors = { High: 'bg-red-100', Medium: 'bg-yellow-100', Low: 'bg-green-100' };
        return colors[priority] || 'bg-gray-100';
    };

    return (
        <div className={`p-4 rounded-lg shadow ${getPriorityColor(task.priority)}`}>
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <div className="flex justify-between items-center mt-4">
                <div>
                    <span className="px-2 py-1 rounded text-sm bg-blue-100">{task.priority}</span>
                    <span className="px-2 py-1 rounded text-sm bg-gray-100 ml-2">{task.status}</span>
                </div>
                <div>
                    <button
                        onClick={() => onUpdate(task.id, { status: 'Completed' })}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                        Complete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskManager;
```

#### **Recommended Libraries:**
- **UI Framework:** Material-UI, Ant Design, or Tailwind CSS
- **State Management:** Redux Toolkit or Zustand
- **HTTP Client:** Axios or React Query
- **Routing:** React Router
- **Forms:** React Hook Form

#### **Pros:**
- ✅ Component-based architecture
- ✅ Rich ecosystem and community
- ✅ Excellent development tools
- ✅ Scalable and maintainable

#### **Cons:**
- ❌ Steeper learning curve
- ❌ Build process required

---

### 🖖 **Option 3: Vue.js (Beginner-Friendly Framework)**

**Best for:** Progressive enhancement, gentle learning curve, rapid development

#### **Setup Instructions:**
```bash
# Create Vue app
npm create vue@latest task-manager-frontend
cd task-manager-frontend
npm install
npm install axios vuetify
npm run dev
```

#### **Example Vue Component:**
```vue
<!-- TaskManager.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6">Task Manager</h1>
      </v-col>
    </v-row>

    <!-- Task Creation Form -->
    <v-card class="mb-6">
      <v-card-title>Create New Task</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="createTask">
          <v-text-field
            v-model="formData.title"
            label="Task Title"
            required
          ></v-text-field>
          
          <v-textarea
            v-model="formData.description"
            label="Description"
          ></v-textarea>
          
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="formData.priority"
                :items="['Low', 'Medium', 'High']"
                label="Priority"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="formData.dueDate"
                type="date"
                label="Due Date"
              ></v-text-field>
            </v-col>
          </v-row>
          
          <v-btn color="primary" type="submit">Create Task</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Task List -->
    <v-row>
      <v-col v-for="task in tasks" :key="task.id" cols="12" md="6" lg="4">
        <TaskCard :task="task" @update="updateTask" @delete="deleteTask" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import TaskCard from './TaskCard.vue'

const API_BASE = 'http://localhost:3000/api/v1'

const tasks = ref([])
const formData = ref({
  title: '',
  description: '',
  priority: 'Medium',
  dueDate: ''
})

const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE}/tasks`)
    tasks.value = response.data.data.tasks
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
}

const createTask = async () => {
  try {
    await axios.post(`${API_BASE}/tasks`, formData.value)
    formData.value = { title: '', description: '', priority: 'Medium', dueDate: '' }
    fetchTasks()
  } catch (error) {
    console.error('Error creating task:', error)
  }
}

const updateTask = async (id, updates) => {
  try {
    await axios.put(`${API_BASE}/tasks/${id}`, updates)
    fetchTasks()
  } catch (error) {
    console.error('Error updating task:', error)
  }
}

onMounted(() => {
  fetchTasks()
})
</script>
```

#### **Pros:**
- ✅ Gentle learning curve
- ✅ Excellent documentation
- ✅ Progressive framework
- ✅ Great developer experience

---

### 🅰️ **Option 4: Angular (Enterprise-Grade)**

**Best for:** Large-scale applications, enterprise environments, TypeScript projects

#### **Setup Instructions:**
```bash
# Install Angular CLI
npm install -g @angular/cli

# Create new project
ng new task-manager-frontend
cd task-manager-frontend
ng add @angular/material
ng generate service services/task
ng generate component components/task-list
ng serve
```

#### **Example Service:**
```typescript
// services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/v1/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<{success: boolean, data: {tasks: Task[]}}> {
    return this.http.get<{success: boolean, data: {tasks: Task[]}}>(this.apiUrl);
  }

  createTask(task: Partial<Task>): Observable<any> {
    return this.http.post(this.apiUrl, task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
```

#### **Pros:**
- ✅ Full-featured framework
- ✅ TypeScript by default
- ✅ Excellent tooling
- ✅ Enterprise-ready

---

### 📱 **Option 5: Mobile Development**

#### **React Native:**
```jsx
// TaskManager.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/tasks');
      const result = await response.json();
      setTasks(result.data.tasks);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Task Manager</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 18 }}>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};
```

---

### 🔧 **Development Tools & Recommendations**

#### **API Integration Best Practices:**
1. **Environment Variables:** Store API URLs in environment files
2. **Error Handling:** Implement proper error boundaries and user feedback
3. **Loading States:** Show loading indicators during API calls
4. **Caching:** Use React Query, SWR, or similar for data caching
5. **Authentication:** Prepare for future auth implementation

#### **Recommended Development Setup:**
```javascript
// config/api.js
const API_CONFIG = {
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-api.com/api/v1'
    : 'http://localhost:3000/api/v1',
  timeout: 10000,
};

// utils/api.js
import axios from 'axios';

const api = axios.create(API_CONFIG);

// Add request/response interceptors
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
```

### 🎯 **Quick Start Recommendations**

1. **Beginners:** Start with **Vanilla JavaScript** template above
2. **Modern Web Apps:** Use **React.js** with Create React App
3. **Rapid Prototyping:** Try **Vue.js** for quick development
4. **Enterprise:** Choose **Angular** for large-scale applications
5. **Mobile:** Use **React Native** or **Flutter**

### 📚 **Learning Resources**

- **React:** https://react.dev/learn
- **Vue.js:** https://vuejs.org/guide/
- **Angular:** https://angular.io/tutorial
- **MDN Web Docs:** https://developer.mozilla.org/

---

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Task categories and tags
- [ ] File attachments
- [ ] Email notifications
- [ ] Task templates
- [ ] Recurring tasks
- [ ] Team collaboration features
- [ ] REST API versioning
- [ ] GraphQL endpoint
- [ ] Real-time updates with WebSockets
- [ ] **GitHub MCP Integration** ✅ (Documentation Complete)
- [ ] Advanced GitHub workflow automation
- [ ] Multi-repository task management
- [ ] GitHub Actions integration

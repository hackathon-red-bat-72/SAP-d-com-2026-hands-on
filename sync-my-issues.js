#!/usr/bin/env node

/**
 * Immediate GitHub Issues to Tasks Sync
 * 
 * This script takes your open GitHub issues and creates tasks in the Task Manager
 * using the GitHub integration we just built.
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';

// Your current open GitHub issue
const myIssues = [
    {
        id: 10681554,
        number: 3,
        title: "I308645 Content Feature",
        body: "## 🎯 Feature Request: Enhanced Content Management System\n\n### **Overview**\nImplement a comprehensive content management feature for the Task Manager API...",
        state: "open",
        html_url: "https://github.tools.sap/GitHubCopilotConferenceBlr-Hands-On/GitHub-Copilot-Hands-on/issues/3",
        user: { login: "I308645" },
        assignee: null,
        labels: [
            { name: "enhancement" },
            { name: "feature" },
            { name: "backend" },
            { name: "api" },
            { name: "content-management" }
        ],
        created_at: "2025-09-28T07:14:31Z",
        updated_at: "2025-09-28T07:14:32Z",
        repository_url: "https://github.tools.sap/api/v3/repos/GitHubCopilotConferenceBlr-Hands-On/GitHub-Copilot-Hands-on"
    }
];

/**
 * Convert GitHub issue to Task format
 */
function convertIssueToTask(issue) {
    // Map priority from labels
    const labelNames = issue.labels.map(label => label.name.toLowerCase());
    let priority = 'Medium';
    
    if (labelNames.some(name => name.includes('high') || name.includes('urgent') || name.includes('critical'))) {
        priority = 'High';
    } else if (labelNames.some(name => name.includes('low') || name.includes('minor'))) {
        priority = 'Low';
    }

    // Extract repository name
    const repository = "GitHubCopilotConferenceBlr-Hands-On/GitHub-Copilot-Hands-on";

    // Truncate description
    let description = issue.body || 'No description provided';
    if (description.length > 500) {
        description = description.substring(0, 497) + '...';
    }

    return {
        title: issue.title,
        description: description,
        priority: priority,
        status: 'Pending',
        githubId: issue.id,
        githubNumber: issue.number,
        githubUrl: issue.html_url,
        githubRepository: repository,
        githubAssignee: issue.assignee?.login || null,
        githubAuthor: issue.user?.login || null,
        githubLabels: issue.labels.map(label => label.name),
        isGitHubIssue: true,
        source: 'github'
    };
}

/**
 * Create task via API
 */
async function createTask(taskData) {
    try {
        const response = await axios.post(`${API_BASE}/tasks`, taskData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        }
        throw error;
    }
}

/**
 * Main sync function
 */
async function syncMyIssues() {
    console.log('🚀 Starting GitHub Issues to Tasks sync...');
    console.log(`📋 Found ${myIssues.length} open issues to sync\n`);

    let created = 0;
    let errors = 0;

    for (const issue of myIssues) {
        try {
            console.log(`Processing: ${issue.title}`);
            console.log(`  🔗 ${issue.html_url}`);
            
            // Convert to task format
            const taskData = convertIssueToTask(issue);
            console.log(`  📊 Priority: ${taskData.priority}`);
            console.log(`  🏷️  Labels: ${taskData.githubLabels.join(', ')}`);
            
            // Create the task
            const result = await createTask(taskData);
            
            if (result.success) {
                created++;
                console.log(`  ✅ Created task: ${result.data.title}`);
                console.log(`  🆔 Task ID: ${result.data._id}`);
            } else {
                errors++;
                console.log(`  ❌ Failed to create task: ${result.message}`);
            }
            
        } catch (error) {
            errors++;
            console.error(`  ❌ Error creating task: ${error.message}`);
        }
        
        console.log(''); // Empty line for readability
    }

    // Summary
    console.log('─'.repeat(50));
    console.log('📊 SYNC SUMMARY');
    console.log('─'.repeat(50));
    console.log(`📋 Total Issues: ${myIssues.length}`);
    console.log(`✅ Tasks Created: ${created}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📈 Success Rate: ${Math.round((created / myIssues.length) * 100)}%`);
    console.log('─'.repeat(50));

    if (created > 0) {
        console.log('\n🎉 Your GitHub issues have been added to Task Manager!');
        console.log('📱 Access your tasks at:');
        console.log('   • Swagger UI: http://localhost:3000/api-docs');
        console.log('   • Kanban Board: http://localhost:3000/public/github-kanban.html');
        console.log('   • API Endpoint: http://localhost:3000/api/v1/tasks');
        console.log('\n💡 You can now:');
        console.log('   • View tasks in the Kanban board');
        console.log('   • Update task status (syncs back to GitHub)');
        console.log('   • Use the GitHub integration endpoints');
        console.log('   • Filter tasks by GitHub repository');
    }
}

// Run the sync
if (require.main === module) {
    syncMyIssues().catch(error => {
        console.error('\n💥 Sync failed:', error.message);
        process.exit(1);
    });
}

module.exports = { syncMyIssues, convertIssueToTask };
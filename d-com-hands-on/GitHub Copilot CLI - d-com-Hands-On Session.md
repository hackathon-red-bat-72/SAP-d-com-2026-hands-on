# Build an End-to-End Solution with GitHub Copilot's Agentic Superpowers

**Duration:** 1 Hour (4 x 15-minute sessions)  
**Participants:** 140 developers  
**Theme:** Build a complete "Team Collaboration" feature from scratch using Copilot CLI's agentic capabilities  
**Project:** Task Manager Backend API (Node.js/Express/PostgreSQL)

---

## The Mission

Transform the single-user Task Manager into a **collaborative team workspace** by building an end-to-end "Team Collaboration" feature:

- **Backend API** - Team and member management endpoints
- **Database Models** - Team, TeamMember, task assignments
- **Frontend Component** - Angular/React team dashboard
- **Automated Tests** - E2E tests with Playwright
- **Documentation** - Auto-generated API docs and GitHub issues

All built using **GitHub Copilot CLI's agentic superpowers** - Plan Mode, Autopilot, MCP Servers, and Custom Agents.

---

## Session Agenda

| Topic | Time |
|-------|------|
| **Architect the Vision** | 00:00 – 00:15 |
| Get introduced to Copilot CLI and design the Team Collaboration feature architecture. | |
| **Code at Light Speed** | 00:15 – 00:30 |
| Use Plan Mode and Autopilot to build the complete Team API backend autonomously. | |
| **Supercharge with Tools** | 00:30 – 00:45 |
| Leverage MCP servers to build the frontend and generate E2E tests. | |
| **Ship with Confidence** | 00:45 – 01:00 |
| Create custom agents to document, review, and prepare for deployment. | |

---

# Session 1: Architect the Vision

## Overview

This session introduces you to **GitHub Copilot CLI** and its agentic capabilities while planning the Team Collaboration feature.

**Introduction to GitHub Copilot CLI and agentic development** (3 minutes)

**Set up and authenticate with Copilot CLI** (4 minutes)

**Plan the Team Collaboration feature architecture** (8 minutes)

We will use the **Task Manager** application as our foundation. By the end of this hour, you'll have built a complete **Team Collaboration** feature - backend API, frontend UI, tests, and documentation - all powered by Copilot CLI's agentic superpowers.

---

## Set up and authenticate with Copilot CLI

1. Please ensure that you have logged in to [https://github.tools.sap](https://github.tools.sap) with your GitHub Enterprise license.

2. Clone the **Mega Hands-On Repository** and install dependencies.

```bash
# Clone the repository
git clone https://github.tools.sap/GitHubCopilotConferenceBlr-Hands-On/GitHub-Copilot-Mega-Hands-On.git

cd GitHub-Copilot-Mega-Hands-On

npm install
```

3. Install and launch GitHub Copilot CLI.

```bash
# Install Copilot CLI globally
npm install -g @github/copilot

# Launch Copilot CLI
copilot

# Authenticate (inside the CLI)
/login
```

> **Note:** Complete SAP SSO authentication when the browser opens. This is a one-time setup.

4. Explore the CLI and select your AI model.

| Prompt | Purpose |
|--------|---------|
| `/help` | View all available **slash commands**. These are your agentic superpowers - `/plan`, `/autopilot`, `/mcp`, `/agents`. |
| `/model` | Select **Claude Sonnet 4.5** as your default model. We'll switch to premium models later for specialized tasks. |

---

## Understand the existing codebase

5. Before building new features, let the AI understand the existing project.

| Prompt | Purpose |
|--------|---------|
| `Analyze this project structure and explain the architecture. I need to understand the patterns used before adding a Team Collaboration feature.` | Let the CLI **explore and summarize** the codebase. It will identify the Express.js patterns, Sequelize models, and API structure we need to follow. |
| `@ src/models/Task.js @ src/controllers/taskController.js Explain how models and controllers are structured in this project. What patterns should I follow for new features?` | Use **@ syntax** to include specific files. The CLI will extract patterns for creating new models and controllers. |

---

## Plan the Team Collaboration feature

6. Enter **Plan Mode** to architect the feature. Press `Shift+Tab` or type `/plan`.

| Prompt | Purpose |
|--------|---------|
| `I need to add a "Team Collaboration" feature to this Task Manager. Teams should be able to: (1) Create and manage teams, (2) Add/remove team members, (3) Assign tasks to team members, (4) View team dashboards with task statistics. Design the complete architecture - database models, API endpoints, and frontend components.` | Experience **Plan Mode's architectural thinking**. Watch as it asks clarifying questions and designs a comprehensive solution before writing any code. |

7. When Plan Mode asks clarifying questions, provide these answers:

- **Team size limit:** Maximum 50 members per team
- **Role system:** Owner, Admin, Member roles
- **Task assignment:** A task can be assigned to one member, members can have multiple tasks
- **Frontend framework:** Angular (or React based on your preference)
- **Authentication:** Use existing user context (assume userId is available)

8. Review the generated architecture plan.

| Prompt | Purpose |
|--------|---------|
| `Show me the complete plan as a checklist. Don't implement yet - I want to review the architecture first.` | Get a **structured checklist** of everything that will be built. This is your roadmap for the next 45 minutes. |

---

## Key Takeaways - Session 1

| Feature | What You Learned |
|---------|------------------|
| **Copilot CLI** | Terminal-based AI pair programmer with agentic capabilities |
| **@ Syntax** | Include specific files for targeted context |
| **Plan Mode** | Structured architecture design before coding |
| **Clarifying Questions** | AI asks questions to ensure correct implementation |

**What's Next:** In Session 2, we'll use Plan Mode and Autopilot to build the entire backend API at light speed.

---

# Session 2: Code at Light Speed

## Overview

This session uses **Plan Mode** and **Autopilot Mode** to build the complete Team Collaboration backend.

**Build database models with Plan Mode** (5 minutes)

**Create API endpoints with Autopilot Mode** (7 minutes)

**Add validation and error handling** (3 minutes)

Experience the **autonomous, iterative, and self-corrective** superpowers of Copilot CLI as it builds a complete backend API with minimal intervention.

---

## Build database models with Plan Mode

1. Ensure you're in **Plan Mode** (`Shift+Tab` if not already enabled).

2. Execute the following prompt to create the database models.

| Prompt | Purpose |
|--------|---------|
| `Create the Sequelize models for Team Collaboration: (1) Team model with id, name, description, createdBy, createdAt, updatedAt. (2) TeamMember model with id, teamId, userId, role (owner/admin/member), joinedAt. (3) Update Task model to add optional assigneeId and teamId fields. Follow the existing patterns in src/models/Task.js.` | Watch Plan Mode **create multiple related models** following existing patterns. It will handle foreign keys, associations, and indexes. |

3. Approve the plan when ready.

```
The model design looks good. Proceed with creating the files.
```

4. Verify the created models.

| Prompt | Purpose |
|--------|---------|
| `@ src/models/ List all models and show me how they're related to each other.` | Verify the **model relationships** are correctly defined (Team hasMany TeamMembers, Task belongsTo Team, etc.). |

---

## Create API endpoints with Autopilot Mode

5. Switch to **Autopilot Mode** for faster, autonomous development. Press `Shift+Tab` to cycle through modes until you see **autopilot** in the status bar.

> **Important:** When entering Autopilot Mode, you will be prompted to choose permissions. Select **"Enable all permissions (recommended)"** to allow the AI to create, modify, and chain operations without asking for permission at each step. Autopilot Mode allows Copilot to work through the task autonomously until it determines the task is complete.

6. Execute the following prompt in **Autopilot Mode**.

| Prompt | Purpose |
|--------|---------|
| `Create a complete REST API for Team Collaboration with these endpoints: POST /api/v1/teams (create team), GET /api/v1/teams (list user's teams), GET /api/v1/teams/:id (get team details), PUT /api/v1/teams/:id (update team), DELETE /api/v1/teams/:id (delete team), POST /api/v1/teams/:id/members (add member), DELETE /api/v1/teams/:id/members/:userId (remove member), GET /api/v1/teams/:id/tasks (get team tasks), PUT /api/v1/tasks/:id/assign (assign task to member). Create the routes, controller, and validation middleware following existing patterns.` | Watch Autopilot **autonomously create multiple files**: routes/teams.js, controllers/teamController.js, middleware/teamValidation.js. Observe the self-corrective behavior if it encounters errors. |

7. Observe the autonomous execution:
- Routes file created automatically
- Controller with all CRUD operations generated
- Validation middleware added
- Server.js updated to include new routes
- **If errors occur**, watch the AI self-correct and retry

8. Exit Autopilot Mode by pressing `Shift+Tab` to cycle back to the default ask/execute mode.

---

## Add validation and error handling

9. Use regular mode to add robust validation.

| Prompt | Purpose |
|--------|---------|
| `Review the team controller and add: (1) Authorization checks - only team owners/admins can modify team, (2) Prevent removing the last owner, (3) Validate team name uniqueness, (4) Add proper error messages for all failure cases.` | Add **business logic validation** that requires careful consideration. Some tasks are better with human review. |

10. Review all backend changes.

| Prompt | Purpose |
|--------|---------|
| `/diff` | View **all file changes** made during this session. You should see 4-6 new/modified files. |
| `/review` | Get an **AI code review** focusing on security, error handling, and best practices. |

---

## Test the API

11. Start the server and test the endpoints.

| Prompt | Purpose |
|--------|---------|
| `Start the development server and test the create team endpoint by sending a POST request to /api/v1/teams with a team name "Engineering" and description "Engineering team". Show me the response.` | Let the CLI **start the server and test the API** autonomously. It will run the dev server and make the HTTP request for you. |

---

## Key Takeaways - Session 2

| Feature | What You Learned |
|---------|------------------|
| **Plan Mode** | Structured model creation with relationship handling |
| **Autopilot Mode** | `Shift+Tab` to cycle to autopilot for autonomous multi-file generation |
| **Self-Correction** | AI automatically fixes errors during autonomous execution |
| **! Syntax** | Execute shell commands without leaving the CLI |
| **/diff & /review** | Always review AI-generated code before committing |

**What's Next:** In Session 3, we'll use MCP servers to supercharge our development with frontend and tests.

---

# Session 3: Supercharge with Tools

## Overview

This session leverages **MCP (Model Context Protocol) servers** to build the frontend and generate automated tests.

**Introduction to MCP servers** (2 minutes)

**Build Angular frontend with UI5/Fiori MCP** (7 minutes)

**Generate E2E tests with Playwright MCP** (6 minutes)

Discover how **MCP servers act as force multipliers** - connecting the CLI to external tools, documentation, and frameworks for truly full-stack agentic development.

---

## Introduction to MCP servers

1. Copy the MCP server configuration to your Copilot CLI config.

```bash
# Copy the MCP server definitions from the project to your Copilot CLI config
cp mcp.json ~/.copilot/mcp-config.json
```

> **Note:** This copies the pre-configured MCP server definitions (Context7, Playwright, Angular, Fiori/UI5) so that Copilot CLI can use them. The **GitHub MCP server is already built-in** to Copilot CLI and does not need to be included in this file. If you already have an existing `mcp-config.json`, merge the contents manually to avoid overwriting your current configuration.

2. Set up a **Personal Access Token (PAT)** for the GitHub MCP server.

The GitHub MCP server comes **built-in** with Copilot CLI, but requires a PAT to authenticate with GitHub. Follow these steps to create one:

   1. Login to [GitHub](https://github.com/settings/tokens/new).
   2. Give it a **name** and set an **expiration**.
   3. Select (at least) the following scopes:
      - `read:packages`
      - `repo`
   4. Click **Generate token**.
   5. **Copy the generated token** and save it securely - you won't be able to see it again.

Set the environment variable before launching Copilot CLI:

```bash
export GITHUB_TOKEN=<your-pat-token>
```

> **Tip:** Add the export to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.) so it persists across terminal sessions.

3. Verify the configured MCP servers.

```
/mcp
```

4. Your project has these MCP servers available:

| MCP Server | Capability |
|------------|------------|
| **GitHub** (built-in) | Repository operations, issues, PRs |
| **Context7** | Up-to-date framework documentation |
| **Playwright** | E2E test generation and execution |
| **Angular** | Angular component patterns and best practices |
| **Fiori/UI5** | SAP Fiori design guidelines and UI5 components |

---

## Build Angular frontend with MCP

5. Switch to a premium model for complex frontend generation.

```
/model opus
```

6. Use the Angular MCP to generate the frontend.

| Prompt | Purpose |
|--------|---------|
| `Using the Angular MCP server, create a Team Dashboard component for our Task Manager. It should display: (1) Team name and description header, (2) Member list with roles and avatars, (3) Task board showing tasks grouped by status (Pending, In Progress, Completed), (4) Statistics cards showing total tasks, completed tasks, overdue tasks. Use Angular Material components and follow SAP Fiori design principles.` | The **Angular MCP** provides current Angular patterns while generating a complete dashboard component with proper structure. |

7. Generate team management components.

| Prompt | Purpose |
|--------|---------|
| `Using Angular MCP, create these additional components: (1) TeamListComponent - shows all teams the user belongs to, (2) CreateTeamDialogComponent - modal form to create new team, (3) ManageMembersDialogComponent - add/remove team members, (4) AssignTaskDialogComponent - assign a task to a team member. Include proper form validation and error handling.` | Build a **complete component library** for team collaboration. MCP ensures components follow Angular best practices. |

8. Connect frontend to backend API.

| Prompt | Purpose |
|--------|---------|
| `Create an Angular TeamService that connects to our backend API. Include methods for all team operations with proper error handling, loading states, and TypeScript interfaces matching our API response format.` | Generate the **service layer** that connects frontend to our Session 2 backend. |

---

## Generate E2E tests with Playwright MCP

9. Use Playwright MCP to generate comprehensive E2E tests.

| Prompt | Purpose |
|--------|---------|
| `Using Playwright MCP, generate end-to-end tests for the Team Collaboration feature. Test scenarios: (1) Create a new team, (2) Add a member to the team, (3) Assign a task to a team member, (4) View team dashboard and verify task statistics, (5) Remove a member from the team. Include proper assertions, test data setup, and cleanup.` | **Playwright MCP** generates production-ready E2E tests with proper page objects, assertions, and test isolation. |

10. Generate API integration tests.

| Prompt | Purpose |
|--------|---------|
| `Using Playwright MCP, create API tests for the team endpoints. Test all CRUD operations, authorization checks (non-owner cannot delete team), and edge cases (cannot remove last owner). Use Playwright's API testing capabilities.` | Generate **API-level tests** that validate our backend independent of the UI. |

11. Run the generated tests.

| Prompt | Purpose |
|--------|---------|
| `! npx playwright test --project=api-tests` | **Execute the API tests** directly from the CLI to verify our backend works correctly. |

---

## Use Context7 for documentation

12. Fetch current documentation to improve our code.

| Prompt | Purpose |
|--------|---------|
| `Using Context7, get the latest Angular 18 documentation for signals and update our TeamService to use signals for reactive state management instead of BehaviorSubjects.` | **Context7 MCP** provides current documentation, ensuring we use the latest Angular patterns rather than outdated approaches. |

---

## Key Takeaways - Session 3

| Feature | What You Learned |
|---------|------------------|
| **MCP Servers** | External tools that extend CLI capabilities |
| **Angular MCP** | Generate framework-compliant components |
| **Playwright MCP** | Automated E2E and API test generation |
| **Context7 MCP** | Access current documentation for any library |
| **Premium Models** | Use Opus for complex generation tasks |

**What's Next:** In Session 4, we'll create custom agents and ship with confidence.

---

# Session 4: Ship with Confidence

## Overview

This session creates **custom agents** and uses them to document, review, and prepare the feature for deployment.

**Create custom agents for your workflow** (5 minutes)

**Document the feature with GitHub MCP** (5 minutes)

**Final review and deployment preparation** (5 minutes)

Learn to **extend the CLI's capabilities** by creating custom agents tailored to your team's workflows, then use them to ship your feature.

---

## Create custom agents

1. Understand the agent structure.

| Prompt | Purpose |
|--------|---------|
| `/agents` | View **available agents** in the project. Agents are specialized AI assistants with predefined instructions. |

2. Create a custom agent for team feature development.

| Prompt | Purpose |
|--------|---------|
| `Create a custom agent at .github/agents/team-feature-expert.md with these specifications: Role: Expert in the Team Collaboration feature we just built. Instructions: (1) Understand Team and TeamMember models and their relationships, (2) Follow the controller patterns in teamController.js, (3) Always include authorization checks for team operations, (4) Generate tests for any new functionality. Context files: src/models/Team.js, src/models/TeamMember.js, src/controllers/teamController.js` | Create a **domain-specific agent** that understands the feature we just built. Future developers can use this agent for consistent enhancements. |

3. Create a code review agent.

| Prompt | Purpose |
|--------|---------|
| `Create a custom agent at .github/agents/security-reviewer.md that specializes in security review. It should check for: (1) SQL injection vulnerabilities, (2) Missing authorization checks, (3) Input validation gaps, (4) Sensitive data exposure, (5) OWASP Top 10 issues. Output should include severity level and remediation steps.` | Create a **security-focused agent** for thorough code reviews before deployment. |

4. Invoke the custom agents.

| Prompt | Purpose |
|--------|---------|
| `@security-reviewer Review all the code we created in this session for security vulnerabilities.` | **Invoke the security agent** to review our Team Collaboration feature for security issues. |
| `@team-feature-expert Add a feature to track when a team member last viewed the team dashboard. Include the model change, API endpoint, and frontend update.` | Use the **team feature agent** to add functionality following our established patterns. |

---

## Document the feature with GitHub MCP

5. Create comprehensive documentation using GitHub MCP.

| Prompt | Purpose |
|--------|---------|
| `Using GitHub MCP, create a new issue titled "Team Collaboration Feature - Documentation" with a complete feature description including: (1) Feature overview, (2) API endpoint documentation, (3) Database schema changes, (4) Frontend components, (5) Testing instructions. Label it as "documentation".` | Use **GitHub MCP** to create an issue with full documentation directly in the repository. |

6. Create follow-up issues for future enhancements.

| Prompt | Purpose |
|--------|---------|
| `Using GitHub MCP, create three follow-up issues for Team Collaboration enhancements: (1) "Add team activity feed" - track all team actions, (2) "Add team notifications" - notify members of assignments, (3) "Add team analytics dashboard" - charts and metrics. Label them as "enhancement" and link them as related issues.` | Create a **roadmap of issues** for future development, directly in GitHub. |

---

## Final review and deployment preparation

7. Switch to premium model for comprehensive review.

```
/model opus
```

8. Conduct final review.

| Prompt | Purpose |
|--------|---------|
| `/diff` | View **complete diff** of all changes made during the 1-hour session. |
| `/review` | Get a **comprehensive code review** from the AI covering security, performance, and best practices. |
| `Generate a deployment checklist for the Team Collaboration feature. Include database migrations, environment variables, feature flags, and rollback procedures.` | Create a **deployment checklist** to ensure safe production release. |

9. Generate commit message and summary.

| Prompt | Purpose |
|--------|---------|
| `Generate a detailed commit message for all the changes we made today. Follow conventional commits format and include a summary of the complete Team Collaboration feature.` | Create a **meaningful commit message** that documents the entire feature. |

---

## What We Built Today - Complete Recap

| Layer | Components Created |
|-------|-------------------|
| **Database** | Team model, TeamMember model, Task assignment fields |
| **Backend API** | 9 new endpoints for team CRUD, member management, task assignment |
| **Frontend** | TeamDashboard, TeamList, CreateTeamDialog, ManageMembersDialog, AssignTaskDialog components |
| **Tests** | E2E tests for team workflows, API integration tests |
| **Documentation** | GitHub issues with feature docs and enhancement roadmap |
| **Custom Agents** | team-feature-expert, security-reviewer agents |

---

## Key Takeaways - Session 4

| Feature | What You Learned |
|---------|------------------|
| **Custom Agents** | Create `.github/agents/*.md` for specialized assistants |
| **@agent-name** | Invoke agents for domain-specific tasks |
| **GitHub MCP** | Create issues and documentation directly from CLI |
| **Premium Models** | Use Opus for comprehensive reviews and complex tasks |
| **End-to-End** | Built complete feature: backend, frontend, tests, docs |

---

# Session Summary

## The End-to-End Solution You Built

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEAM COLLABORATION FEATURE                    │
├─────────────────────────────────────────────────────────────────┤
│  SESSION 1: ARCHITECTURE                                         │
│  └── Planned complete feature with Plan Mode                     │
├─────────────────────────────────────────────────────────────────┤
│  SESSION 2: BACKEND                                              │
│  ├── Team & TeamMember models (Sequelize)                        │
│  ├── 9 REST API endpoints                                        │
│  ├── Validation middleware                                       │
│  └── Authorization checks                                        │
├─────────────────────────────────────────────────────────────────┤
│  SESSION 3: FRONTEND & TESTING                                   │
│  ├── 5 Angular components (Dashboard, Dialogs)                   │
│  ├── TeamService with API integration                            │
│  ├── E2E tests (Playwright)                                      │
│  └── API integration tests                                       │
├─────────────────────────────────────────────────────────────────┤
│  SESSION 4: DEVOPS & SHIPPING                                    │
│  ├── Custom agents (team-feature-expert, security-reviewer)      │
│  ├── GitHub issues for documentation                             │
│  ├── Enhancement roadmap                                         │
│  └── Deployment checklist                                        │
└─────────────────────────────────────────────────────────────────┘
```

## Agentic Superpowers Used

| Superpower | How We Used It |
|------------|----------------|
| **Plan Mode** | Architected the complete feature before coding |
| **Autopilot Mode** | Built entire backend API autonomously |
| **MCP Servers** | Generated frontend with Angular MCP, tests with Playwright MCP |
| **Custom Agents** | Created domain experts for future development |
| **Premium Models** | Used Opus for architecture and comprehensive reviews |

## Quick Reference

### Essential Commands
| Command | Action |
|---------|--------|
| `/plan` | Enter Plan Mode (or use `Shift+Tab`) |
| `Shift+Tab` | Cycle modes: ask/execute → plan → autopilot |
| `/mcp` | View MCP servers |
| `/agents` | List custom agents |
| `/model` | Select AI model |
| `/diff` | Review all changes |
| `/review` | AI code review |

### Syntax Reference
| Syntax | Purpose |
|--------|---------|
| `@ file` | Include file in context |
| `! cmd` | Execute shell command |
| `@agent-name` | Invoke custom agent |
| `Shift+Tab` | Toggle Plan Mode |

---

## Next Steps

1. **Practice** - Continue enhancing the Team Collaboration feature
2. **Create Agents** - Build custom agents for your team's workflows
3. **Explore MCPs** - Try SAP-specific MCPs (CAP, Fiori, UI5, MDK)
4. **Share Knowledge** - Help teammates adopt Copilot CLI

## Resources

- **CLI Documentation**: https://docs.github.com/copilot/cli
- **MCP Servers**: https://modelcontextprotocol.io
- **Support**: GitHub Copilot Teams channel

---

*Build an End-to-End Solution with GitHub Copilot's Agentic Superpowers - March 2026*

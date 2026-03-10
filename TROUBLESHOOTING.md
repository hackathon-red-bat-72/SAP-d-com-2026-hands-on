# Task Manager API - Troubleshooting Guide

## Common Issues and Solutions

### 1. Swagger Documentation Not Loading

**Problem**: Can't access Swagger UI at `/api-docs`

**Solutions**:

#### Option A: Use Test Server (Recommended for Testing Swagger)
If you want to test the Swagger documentation without setting up MongoDB:

```bash
npm run test-server
```

Then access: http://localhost:3001/api-docs

#### Option B: Set up MongoDB (Required for Full API)
1. **Install MongoDB**:
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://cloud.mongodb.com/

2. **Start MongoDB locally**:
   ```bash
   mongod
   ```

3. **Create .env file**:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   ```

4. **Start the full server**:
   ```bash
   npm run dev
   ```

### 2. Port Already in Use Error

**Error**: `EADDRINUSE: address already in use :::3000`

**Solutions**:

1. **Kill existing Node processes**:
   ```bash
   taskkill /f /im node.exe
   ```

2. **Use a different port**:
   ```bash
   $env:PORT=3001; npm run dev
   ```

3. **Or modify the .env file**:
   ```env
   PORT=3001
   ```

### 3. Database Connection Issues

**Error**: `Database connection not available`

**Solutions**:

1. **For testing Swagger only**: Use `npm run test-server`

2. **For full functionality**:
   - Ensure MongoDB is running
   - Check connection string in .env file
   - Use MongoDB Atlas for cloud database

### 4. Module Not Found Errors

**Solution**:
```bash
npm install
```

## Quick Start Commands

### Just Test Swagger Documentation
```bash
npm run test-server
# Access: http://localhost:3001/api-docs
```

### Full Development Server
```bash
# 1. Start MongoDB (if using local installation)
mongod

# 2. Create .env file with your settings
copy env.example .env

# 3. Start server
npm run dev
# Access: http://localhost:3000/api-docs
```

## Testing the API

### Using Swagger UI
1. Go to http://localhost:3001/api-docs (test server) or http://localhost:3000/api-docs (full server)
2. Click on any endpoint to expand it
3. Click "Try it out"
4. Fill in the parameters/request body
5. Click "Execute"

### Using cURL or PowerShell

#### Health Check
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET

# cURL (if available)
curl http://localhost:3001/health
```

#### Test Task Creation (requires full server with MongoDB)
```bash
# PowerShell
$body = @{
    title = "Test Task"
    description = "Testing API"
    priority = "High"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/tasks" -Method POST -Body $body -ContentType "application/json"
```

## Environment Setup

### Minimal Setup (Swagger Only)
```bash
npm install
npm run test-server
```

### Full Setup (Complete API)
```bash
npm install
# Install MongoDB or set up MongoDB Atlas
# Create .env file
npm run dev
```

## Ports Used
- **3000**: Default full server port
- **3001**: Test server port
- **27017**: Default MongoDB port

## Common Issues

### PostgreSQL connection errors
- Ensure PostgreSQL is running locally
- Check your PG_* variables in the .env file
- Check for network/firewall issues

### Sequelize validation errors
- Check your model definitions and validation rules

### Data not saving
- Ensure your model is correctly defined and connected
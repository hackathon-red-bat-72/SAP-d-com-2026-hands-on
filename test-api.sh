#!/bin/bash

# Task Manager API Test Suite
# Tests all endpoints after PostgreSQL migration

echo "🧪 Task Manager API Test Suite Starting..."
echo "=========================================="

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api/v1/tasks"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print test results
print_test() {
    local test_name="$1"
    local status_code="$2"
    local expected="$3"
    
    if [ "$status_code" = "$expected" ]; then
        echo -e "${GREEN}✅ $test_name - PASSED (Status: $status_code)${NC}"
    else
        echo -e "${RED}❌ $test_name - FAILED (Expected: $expected, Got: $status_code)${NC}"
    fi
}

# Function to make HTTP requests with better error handling
make_request() {
    local method="$1"
    local url="$2"
    local data="$3"
    local expected_status="$4"
    local test_name="$5"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$url")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url")
    fi
    
    # Extract status code (last line) and body (everything else)
    status_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')
    
    print_test "$test_name" "$status_code" "$expected_status"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${BLUE}📄 Response: ${NC}$(echo "$body" | jq -r '.' 2>/dev/null || echo "$body")"
    else
        echo -e "${RED}📄 Error Response: ${NC}$(echo "$body" | jq -r '.' 2>/dev/null || echo "$body")"
    fi
    echo ""
    
    # Return the response for further processing
    echo "$body"
}

echo -e "${YELLOW}🔍 Testing System Endpoints${NC}"
echo "----------------------------------------"

# Test 1: Health Check
make_request "GET" "$BASE_URL/health" "" "200" "Health Check"

# Test 2: Root endpoint
make_request "GET" "$BASE_URL/" "" "200" "Root Endpoint"

# Test 3: API Documentation
status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api-docs")
print_test "API Documentation" "$status_code" "200"
echo ""

echo -e "${YELLOW}📋 Testing Task CRUD Operations${NC}"
echo "----------------------------------------"

# Test 4: Get all tasks (should return seeded data)
tasks_response=$(make_request "GET" "$API_URL" "" "200" "Get All Tasks")

# Test 5: Create a new task
new_task_data='{
    "title": "Test API Integration",
    "description": "Testing all API endpoints after PostgreSQL migration",
    "priority": "High",
    "status": "Pending",
    "dueDate": "2025-10-01T10:00:00.000Z"
}'

created_task=$(make_request "POST" "$API_URL" "$new_task_data" "201" "Create New Task")

# Extract task ID for further tests
task_id=$(echo "$created_task" | jq -r '.data.id' 2>/dev/null)

if [ "$task_id" != "null" ] && [ -n "$task_id" ]; then
    echo -e "${GREEN}🆔 Created task ID: $task_id${NC}"
    
    # Test 6: Get specific task
    make_request "GET" "$API_URL/$task_id" "" "200" "Get Task by ID"
    
    # Test 7: Update task
    update_data='{
        "title": "Updated Test Task",
        "description": "Updated description after PostgreSQL migration test",
        "priority": "Medium",
        "status": "In Progress"
    }'
    
    make_request "PUT" "$API_URL/$task_id" "$update_data" "200" "Update Task"
    
    # Test 8: Partial update (PATCH)
    patch_data='{"status": "Completed"}'
    make_request "PATCH" "$API_URL/$task_id" "$patch_data" "200" "Partial Update Task"
    
else
    echo -e "${RED}❌ Could not extract task ID for further tests${NC}"
fi

echo -e "${YELLOW}🔍 Testing Query Parameters & Filtering${NC}"
echo "----------------------------------------"

# Test 9: Filter by status
make_request "GET" "$API_URL?status=Completed" "" "200" "Filter by Status"

# Test 10: Filter by priority
make_request "GET" "$API_URL?priority=High" "" "200" "Filter by Priority"

# Test 11: Search functionality
make_request "GET" "$API_URL?search=test" "" "200" "Search Tasks"

# Test 12: Pagination
make_request "GET" "$API_URL?page=1&limit=2" "" "200" "Pagination"

# Test 13: Sorting
make_request "GET" "$API_URL?sortBy=createdAt&sortOrder=desc" "" "200" "Sort by Created Date"

# Test 14: Multiple filters
make_request "GET" "$API_URL?status=Pending&priority=High&sortBy=dueDate" "" "200" "Multiple Filters"

echo -e "${YELLOW}📊 Testing Statistics Endpoint${NC}"
echo "----------------------------------------"

# Test 15: Get task statistics
make_request "GET" "$API_URL/stats" "" "200" "Task Statistics"

echo -e "${YELLOW}🗑️ Testing Delete Operations${NC}"
echo "----------------------------------------"

if [ "$task_id" != "null" ] && [ -n "$task_id" ]; then
    # Test 16: Delete task
    make_request "DELETE" "$API_URL/$task_id" "" "200" "Delete Task"
    
    # Test 17: Try to get deleted task (should return 404)
    make_request "GET" "$API_URL/$task_id" "" "404" "Get Deleted Task (Should Fail)"
fi

echo -e "${YELLOW}❌ Testing Error Handling${NC}"
echo "----------------------------------------"

# Test 18: Invalid task ID
make_request "GET" "$API_URL/999999" "" "404" "Invalid Task ID"

# Test 19: Invalid data format
invalid_data='{"title": "", "priority": "Invalid"}'
make_request "POST" "$API_URL" "$invalid_data" "400" "Invalid Data Format"

# Test 20: Missing required fields
missing_data='{"description": "Missing title"}'
make_request "POST" "$API_URL" "$missing_data" "400" "Missing Required Fields"

# Test 21: Invalid route
make_request "GET" "$BASE_URL/api/v1/invalid" "" "404" "Invalid Route"

echo -e "${YELLOW}🔐 Testing Edge Cases${NC}"
echo "----------------------------------------"

# Test 22: Very long title (should be truncated or rejected)
long_title_data='{
    "title": "This is a very long title that exceeds the maximum allowed length for task titles in the database schema and should be properly handled",
    "description": "Testing long title validation"
}'
make_request "POST" "$API_URL" "$long_title_data" "400" "Long Title Validation"

# Test 23: SQL Injection attempt (should be handled safely)
sql_injection_data='{
    "title": "Test; DROP TABLE Tasks; --",
    "description": "SQL injection test"
}'
make_request "POST" "$API_URL" "$sql_injection_data" "201" "SQL Injection Safety"

# Test 24: Unicode characters
unicode_data='{
    "title": "Unicode Test 🚀 中文 العربية",
    "description": "Testing unicode character support"
}'
make_request "POST" "$API_URL" "$unicode_data" "201" "Unicode Support"

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Task Manager API Test Suite Complete!${NC}"
echo "=========================================="

# Get final task count
final_count=$(curl -s "$API_URL" | jq -r '.pagination.total' 2>/dev/null)
if [ "$final_count" != "null" ] && [ -n "$final_count" ]; then
    echo -e "${BLUE}📊 Total tasks in database: $final_count${NC}"
fi

echo -e "${BLUE}💡 You can also test the APIs interactively at: $BASE_URL/api-docs${NC}"
echo -e "${BLUE}🔍 Monitor server logs for detailed information${NC}"
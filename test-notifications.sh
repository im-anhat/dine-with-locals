#!/bin/bash

# Notification System API Test Script
# This script tests all the notification API endpoints

echo "🔔 Testing Notification System API Endpoints"
echo "=============================================="

BASE_URL="http://localhost:3000/api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test user ID (replace with actual user ID for testing)
TEST_USER_ID="USER_ID_PLACEHOLDER"

echo -e "\n${YELLOW}1. Testing GET /notifications/user/:userId${NC}"
echo "------------------------------------------------"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/notifications/user/$TEST_USER_ID")
http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE:/d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Success (200)${NC}"
    echo "Response: $body" | head -n 3
else
    echo -e "${RED}❌ Failed ($http_code)${NC}"
    echo "Response: $body"
fi

echo -e "\n${YELLOW}2. Testing GET /notifications/user/:userId/unread-count${NC}"
echo "--------------------------------------------------------"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/notifications/user/$TEST_USER_ID/unread-count")
http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE:/d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Success (200)${NC}"
    echo "Response: $body"
else
    echo -e "${RED}❌ Failed ($http_code)${NC}"
    echo "Response: $body"
fi

echo -e "\n${YELLOW}3. Socket.IO Connection Test${NC}"
echo "--------------------------------"
echo "To test Socket.IO connection:"
echo "1. Open browser to http://localhost:5173/test/notifications"
echo "2. Check connection status in the UI"
echo "3. Try sending test notifications between users"

echo -e "\n${YELLOW}4. Real Notification Test${NC}"
echo "-----------------------------"
echo "To test real notifications:"
echo "1. Create a blog post"
echo "2. Like or comment on the post with a different user"
echo "3. Check notification center for real-time updates"

echo -e "\n${GREEN}🎉 Notification System Test Complete!${NC}"
echo "========================================"
echo "For manual testing:"
echo "- Client: http://localhost:5173"
echo "- Test page: http://localhost:5173/test/notifications"
echo "- Server: http://localhost:3000"

echo -e "\n${YELLOW}Note:${NC} Replace TEST_USER_ID with actual user ID for API testing"

#!/bin/bash
# CI/CD Test Script for Dine-with-Locals Server
# This script runs all tests and ensures they pass before deployment

set -e # Exit immediately if a command exits with a non-zero status

echo "Starting server test pipeline..."

# Environment setup
echo "Setting up test environment..."
export NODE_ENV=test
export NODE_OPTIONS="--max-old-space-size=4096" # Increase memory limit

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run ESLint
echo "Running linting checks..."
npm run lint

# TypeScript type checking
echo "Running TypeScript type checking..."
npm run type-check

# Run tests with coverage
echo "Running tests with coverage..."
npm run test:coverage -- --config=jest.config.ci.json --ci --reporters=default --reporters=jest-junit

# Check coverage thresholds (handled by Jest config)
# Check exit status
if [ $? -eq 0 ]; then
    echo "✅ All tests passed successfully!"
    exit 0
else
    echo "❌ Tests failed. Check the logs for details."
    exit 1
fi

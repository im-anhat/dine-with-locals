# CI/CD Testing Strategy for Dine with Locals Server

## Introduction

This document outlines the testing strategy and implementation for the Dine with Locals server application. We've created a comprehensive testing framework that can be used in CI/CD pipelines to ensure the quality and reliability of the codebase.

## Test Structure

We've organized the tests into the following structure:

```
server/src/test/
├── controllers/           # Unit tests for controllers
│   ├── AuthController.test.ts
│   ├── ListingController.test.ts
│   ├── RequestController.test.ts
│   └── UserController.test.ts
├── integration/           # End-to-end integration tests
│   └── ListingRequestFlow.test.ts
├── helpers/               # Test utilities and helpers
│   └── testHelpers.ts
├── setup.ts               # Global test setup
├── testApp.ts             # Test application factory
└── README.md              # Documentation
```

## Key Components

1. **Jest Configuration**:

   - `jest.config.json` - Standard configuration for local development
   - `jest.config.ci.json` - Configuration for CI environments with stricter requirements

2. **Test Helpers**:

   - `testHelpers.ts` - Utilities for creating test users, listings, requests, and locations

3. **Test Application**:

   - `testApp.ts` - Express app factory that mirrors the production app but uses in-memory databases

4. **CI Script**:
   - `test-ci.sh` - Shell script for running tests in CI environments

## Running Tests

The following npm scripts have been added to package.json:

```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage",
"test:ci": "jest --config=jest.config.ci.json --ci",
"test:integration": "jest src/test/integration",
"test:controllers": "jest src/test/controllers"
```

## CI/CD Integration

The `test-ci.sh` script is designed to be used in CI/CD pipelines. It:

1. Sets up the test environment
2. Installs dependencies
3. Runs linting checks
4. Performs TypeScript type checking
5. Runs tests with coverage reporting
6. Exits with the appropriate status code

## Next Steps to Make Tests Pass

Based on the test run, several issues need to be addressed:

1. **Route Definitions**:

   - Some routes like `/api/auth/register` and `/api/auth/login` are not properly defined in the test app.
   - The actual implementations in the controllers need to be verified against the test expectations.

2. **Validation Requirements**:

   - The `User` model requires a `locationId` which needs to be handled in the test data creation.
   - Update the `createTestUser` helper to ensure all required fields are provided.

3. **Error Handling**:

   - Status codes in the error responses don't match expectations (e.g., 400 vs 401, 403 vs 400).
   - Review error handling in the controllers and middleware.

4. **Authentication Flow**:

   - JWT token validation and user attachment needs to be fixed in the test app.

5. **Test Data Consistency**:
   - Ensure test data created in `beforeEach` hooks is properly cleaned up.
   - Make sure IDs and references between models are consistent.

## Benefits for CI/CD

This testing framework provides several benefits for CI/CD:

1. **Early Detection of Issues**: Catches bugs before they reach production
2. **Code Quality Metrics**: Coverage reports identify untested code
3. **Regression Prevention**: Ensures changes don't break existing functionality
4. **Documentation**: Tests serve as living documentation of expected behavior
5. **Confidence in Deployments**: Successful test runs indicate deployability

## Conclusion

The testing infrastructure is now in place, but some adjustments are needed to make the tests pass. Once these issues are addressed, the tests will provide a reliable foundation for CI/CD pipelines and ongoing development.

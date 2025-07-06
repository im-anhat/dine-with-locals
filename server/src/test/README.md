# Dine with Locals - Server Tests

This directory contains tests for the Dine with Locals server application. The testing strategy is designed to ensure comprehensive coverage of controllers, services, and integration flows.

## Testing Structure

The tests are organized as follows:

- **Controllers Tests**: Unit tests for individual controller functions
- **Integration Tests**: End-to-end tests for complex business flows
- **Helpers**: Utility functions for creating test data and mocks

## Running Tests

To run all tests:

```bash
npm test
```

To run tests with coverage:

```bash
npm run test:coverage
```

To run specific test groups:

```bash
# Run only controller tests
npm run test:controllers

# Run only integration tests
npm run test:integration

# Run tests in watch mode (during development)
npm run test:watch
```

## CI/CD Integration

For continuous integration, use:

```bash
# Run the CI test script
./test-ci.sh
```

Or directly:

```bash
npm run test:ci
```

## Test Environment

Tests run using:

- **Jest**: Test runner and assertion library
- **SuperTest**: HTTP testing library
- **MongoDB Memory Server**: In-memory database for tests

The test environment is automatically configured via `setup.ts` to use:

- In-memory MongoDB database
- Test JWT secret
- Mocked external services

## Coverage Requirements

The project maintains the following minimum coverage thresholds:

- Statements: 70%
- Branches: 70%
- Functions: 70%
- Lines: 70%

## Writing New Tests

When adding new tests:

1. Place controller tests in `controllers/` directory
2. Place integration tests in `integration/` directory
3. Use helper functions from `helpers/testHelpers.ts` to create test data
4. Follow the existing patterns for setting up and tearing down test data

## Mocking Strategy

- **Database**: Uses MongoDB Memory Server
- **Authentication**: JWT tokens are generated for test users
- **External APIs**: Configured to be disabled during testing

## Common Issues

- **Timeouts**: Integration tests may require longer timeouts
- **Database Connection**: Ensure tests properly clean up after themselves
- **Authentication**: Ensure valid tokens are generated for protected routes

/**
 * Test setup file for Jest
 * This file is run before all tests to set up the testing environment
 */

// @ts-nocheck - This file uses CommonJS for Jest compatibility
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Load test environment variables first
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
// Set the same JWT secret that tests expect
process.env.SECRET = 'test-secret';

let mongod: any;

/**
 * Connect to the in-memory database before running tests
 */
beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    mongod = await MongoMemoryServer.create({
      instance: { dbName: 'testdb' },
    });
    const uri = mongod.getUri();

    await mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
  }
}, 10000);

/**
 * Clear all test data after every test
 */
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    await Promise.all(
      Object.keys(collections).map((key) => collections[key].deleteMany({})),
    );
  }
});

/**
 * Clean up after all tests
 */
afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongod) {
    await mongod.stop();
  }
}, 10000);

// Quiet console for CI
if (process.env.NODE_ENV === 'test' && !process.env.JEST_VERBOSE) {
  global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  };
}

jest.setTimeout(15000);

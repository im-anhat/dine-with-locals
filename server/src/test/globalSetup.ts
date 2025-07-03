/**
 * Global setup for Jest tests
 * Ensures safe test environment initialization
 */

export default async function globalSetup() {
  // Only log in verbose mode to speed up CI
  const verbose = process.env.JEST_VERBOSE !== 'false';

  if (verbose) {
    console.log('🧪 Setting up test environment...');
  }

  // Force NODE_ENV to test to ensure we're in test mode
  process.env.NODE_ENV = 'test';

  // Ensure we're using test database settings
  process.env.MONGO_URI = 'memory://test';

  // Disable external API calls during tests
  process.env.DISABLE_EXTERNAL_APIS = 'true';
  process.env.DISABLE_SOCKET_IO = 'true';
  process.env.DISABLE_CLOUDINARY = 'true';

  // Set test-specific secrets
  process.env.SECRET = 'test-jwt-secret-key-for-testing-only';

  // Mock external services
  process.env.GOOGLE_MAPS_API_KEY = 'test-google-maps-key';
  process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
  process.env.CLOUDINARY_API_KEY = 'test-key';
  process.env.CLOUDINARY_API_SECRET = 'test-secret';

  if (verbose) {
    console.log('✅ Test environment configured safely');
    console.log('   - Using in-memory database');
    console.log('   - External APIs disabled');
    console.log('   - Test JWT secret set');
    console.log('   - Socket.IO disabled');
    console.log('   - Cloudinary mocked');
  }
}

/**
 * Global teardown for Jest tests
 * Ensures clean test environment cleanup
 */

export default async function globalTeardown() {
  console.log('🧹 Cleaning up test environment...');

  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }

  // Clean up any test artifacts
  console.log('✅ Test environment cleaned up');
}

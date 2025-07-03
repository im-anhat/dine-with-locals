/**
 * Test AuthController import
 */

describe('AuthController Import Test', () => {
  it('should import AuthController without errors', () => {
    const AuthController = require('../../controllers/AuthController');
    expect(AuthController).toBeDefined();
  });

  it('should have loginUser function', () => {
    const AuthController = require('../../controllers/AuthController');
    expect(AuthController.loginUser).toBeDefined();
    expect(typeof AuthController.loginUser).toBe('function');
  });

  it('should have signupUser function', () => {
    const AuthController = require('../../controllers/AuthController');
    expect(AuthController.signupUser).toBeDefined();
    expect(typeof AuthController.signupUser).toBe('function');
  });
});

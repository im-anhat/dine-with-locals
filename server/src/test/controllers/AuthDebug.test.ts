describe('Auth Debug Test', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should be able to require modules', () => {
    const bcrypt = require('bcrypt');
    expect(bcrypt).toBeDefined();
  });
});

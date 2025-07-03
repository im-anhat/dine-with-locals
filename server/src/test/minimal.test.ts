/**
 * Minimal Working Test
 * Just to verify our Jest setup works
 */

describe('Minimal Test Suite', () => {
  it('should run basic arithmetic', () => {
    expect(2 + 2).toBe(4);
  });

  it('should work with strings', () => {
    expect('hello').toBe('hello');
  });

  it('should work with arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  it('should work with objects', () => {
    const obj = { name: 'test', value: 42 };
    expect(obj).toHaveProperty('name', 'test');
    expect(obj.value).toBe(42);
  });

  it('should work with async/await', async () => {
    const promise = Promise.resolve('success');
    const result = await promise;
    expect(result).toBe('success');
  });
});

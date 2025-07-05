import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn utility function', () => {
  it('should combine class names correctly', () => {
    const result = cn('class1', 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('should handle conditional classes', () => {
    const result = cn(
      'base-class',
      true && 'conditional-class',
      false && 'hidden-class',
    );
    expect(result).toContain('base-class');
    expect(result).toContain('conditional-class');
    expect(result).not.toContain('hidden-class');
  });

  it('should handle undefined and null values', () => {
    const result = cn('base-class', undefined, null, 'valid-class');
    expect(result).toContain('base-class');
    expect(result).toContain('valid-class');
    expect(result).not.toContain('undefined');
    expect(result).not.toContain('null');
  });

  it('should handle empty strings', () => {
    const result = cn('base-class', '', 'valid-class');
    expect(result).toContain('base-class');
    expect(result).toContain('valid-class');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
    expect(result).toContain('class3');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      active: true,
      disabled: false,
      visible: true,
    });
    expect(result).toContain('active');
    expect(result).toContain('visible');
    expect(result).not.toContain('disabled');
  });

  it('should handle complex combinations', () => {
    const isActive = true;
    const isDisabled = false;
    const variant = 'primary';

    const result = cn(
      'base-class',
      variant && `variant-${variant}`,
      {
        active: isActive,
        disabled: isDisabled,
      },
      isActive && 'state-active',
    );

    expect(result).toContain('base-class');
    expect(result).toContain('variant-primary');
    expect(result).toContain('active');
    expect(result).toContain('state-active');
    expect(result).not.toContain('disabled');
  });

  it('should handle duplicate classes', () => {
    const result = cn('class1', 'class2', 'class1');

    // Check that the result contains both classes
    expect(result).toContain('class1');
    expect(result).toContain('class2');

    // The exact deduplication behavior depends on tailwind-merge implementation
    // Just ensure it's a valid string
    expect(typeof result).toBe('string');
  });

  it('should handle no arguments', () => {
    const result = cn();
    expect(typeof result).toBe('string');
    expect(result.trim()).toBe('');
  });

  it('should handle nested arrays and objects', () => {
    const result = cn('base', [
      'array-class',
      {
        'nested-object': true,
        'nested-false': false,
      },
    ]);

    expect(result).toContain('base');
    expect(result).toContain('array-class');
    expect(result).toContain('nested-object');
    expect(result).not.toContain('nested-false');
  });
});

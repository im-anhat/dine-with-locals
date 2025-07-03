/**
 * Simple Auth Test Debug
 */

describe('Simple Auth Test', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should require supertest', () => {
    const request = require('supertest');
    expect(request).toBeDefined();
  });

  it('should require express', () => {
    const express = require('express');
    expect(express).toBeDefined();
  });
});

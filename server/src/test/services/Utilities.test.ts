/**
 * Services and Utilities Test Suite
 * Tests for helper functions and service layer components
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

describe('Service Layer Tests', () => {
  describe('JWT Token Utilities', () => {
    const testSecret = 'test-jwt-secret-key';
    const testUserId = '507f1f77bcf86cd799439011';

    beforeEach(() => {
      process.env.SECRET = testSecret;
    });

    it('should create valid JWT tokens', () => {
      const token = jwt.sign({ _id: testUserId }, testSecret, {
        expiresIn: '3d',
      });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should verify JWT tokens correctly', () => {
      const token = jwt.sign({ _id: testUserId }, testSecret, {
        expiresIn: '3d',
      });
      const decoded = jwt.verify(token, testSecret) as any;

      expect(decoded._id).toBe(testUserId);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });

    it('should reject invalid JWT tokens', () => {
      const invalidTokens = [
        'invalid.token.format',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid',
        '',
        null,
        undefined,
      ];

      invalidTokens.forEach((token) => {
        if (token) {
          expect(() => {
            jwt.verify(token, testSecret);
          }).toThrow();
        }
      });
    });

    it('should handle expired tokens', () => {
      const expiredToken = jwt.sign({ _id: testUserId }, testSecret, {
        expiresIn: '-1s',
      });

      expect(() => {
        jwt.verify(expiredToken, testSecret);
      }).toThrow('jwt expired');
    });

    it('should handle wrong secret', () => {
      const token = jwt.sign({ _id: testUserId }, testSecret, {
        expiresIn: '3d',
      });

      expect(() => {
        jwt.verify(token, 'wrong-secret');
      }).toThrow('invalid signature');
    });
  });

  describe('Password Hashing Utilities', () => {
    const testPassword = 'testpassword123';
    const saltRounds = 12;

    it('should hash passwords correctly', async () => {
      const hashedPassword = await bcrypt.hash(testPassword, saltRounds);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(testPassword);
      expect(hashedPassword.length).toBeGreaterThan(50); // bcrypt hashes are long
    });

    it('should verify correct passwords', async () => {
      const hashedPassword = await bcrypt.hash(testPassword, saltRounds);
      const isValid = await bcrypt.compare(testPassword, hashedPassword);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect passwords', async () => {
      const hashedPassword = await bcrypt.hash(testPassword, saltRounds);
      const isValid = await bcrypt.compare('wrongpassword', hashedPassword);

      expect(isValid).toBe(false);
    });

    it('should handle empty passwords', async () => {
      const emptyPassword = '';
      const hashedPassword = await bcrypt.hash(emptyPassword, saltRounds);

      expect(hashedPassword).toBeDefined();

      const isValid = await bcrypt.compare(emptyPassword, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should create different hashes for same password', async () => {
      const hash1 = await bcrypt.hash(testPassword, saltRounds);
      const hash2 = await bcrypt.hash(testPassword, saltRounds);

      expect(hash1).not.toBe(hash2);

      // Both should verify correctly
      expect(await bcrypt.compare(testPassword, hash1)).toBe(true);
      expect(await bcrypt.compare(testPassword, hash2)).toBe(true);
    });
  });

  describe('Environment Configuration', () => {
    it('should have test environment set', () => {
      expect(process.env.NODE_ENV).toBe('test');
    });

    it('should have required environment variables', () => {
      const requiredVars = ['SECRET', 'NODE_ENV'];

      requiredVars.forEach((varName) => {
        expect(process.env[varName]).toBeDefined();
        expect(process.env[varName]).not.toBe('');
      });
    });

    it('should use test-specific configurations', () => {
      // In test mode, either test-specific or main SECRET should be defined
      expect(process.env.SECRET).toBeDefined();
      expect(process.env.SECRET).not.toBe('');
      expect(process.env.NODE_ENV).toBe('test');
    });

    it('should disable external APIs in test mode', () => {
      expect(process.env.DISABLE_EXTERNAL_APIS).toBe('true');
      expect(process.env.DISABLE_SOCKET_IO).toBe('true');
      expect(process.env.DISABLE_CLOUDINARY).toBe('true');
    });
  });

  describe('Validation Utilities', () => {
    describe('Email Validation', () => {
      const isValidEmail = (email: string): boolean => {
        if (!email || email.length === 0 || email.length > 254) return false;
        if (email.includes('..')) return false; // No consecutive dots
        if (email.startsWith('@') || email.endsWith('@')) return false;
        if (!email.includes('@')) return false;

        const parts = email.split('@');
        if (parts.length !== 2) return false;
        if (parts[0].length === 0 || parts[1].length === 0) return false;
        if (!parts[1].includes('.')) return false; // Must have domain extension

        const emailRegex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email);
      };

      it('should validate correct email formats', () => {
        const validEmails = [
          'test@example.com',
          'user.name@domain.co.uk',
          'user+tag@example.org',
          'firstname.lastname@company.com',
        ];

        validEmails.forEach((email) => {
          expect(isValidEmail(email)).toBe(true);
        });
      });

      it('should reject invalid email formats', () => {
        const invalidEmails = [
          'invalid-email',
          '@example.com',
          'test@',
          'test..test@example.com',
          'test@example',
          '',
        ];

        invalidEmails.forEach((email) => {
          expect(isValidEmail(email)).toBe(false);
        });
      });
    });

    describe('Phone Number Validation', () => {
      const isValidPhone = (phone: string): boolean => {
        if (!phone || phone.trim().length === 0) return false;

        // Check for non-numeric characters (except allowed formatting)
        const cleanPhone = phone.replace(/[\s\-\(\)\.\+]/g, '');
        if (!/^\d+$/.test(cleanPhone)) return false;

        // Check length (7-15 digits is reasonable for international numbers)
        if (cleanPhone.length < 7 || cleanPhone.length > 15) return false;

        return true;
      };

      it('should validate correct phone formats', () => {
        const validPhones = [
          '+1234567890',
          '+1 (234) 567-8900',
          '1234567890',
          '+44 20 7946 0958',
        ];

        validPhones.forEach((phone) => {
          expect(isValidPhone(phone)).toBe(true);
        });
      });

      it('should reject invalid phone formats', () => {
        const invalidPhones = [
          '123',
          'abc1234567890',
          '',
          '+1234567890123456789', // Too long
        ];

        invalidPhones.forEach((phone) => {
          expect(isValidPhone(phone)).toBe(false);
        });
      });
    });

    describe('Username Validation', () => {
      const isValidUsername = (username: string): boolean => {
        return (
          username.length >= 3 &&
          username.length <= 30 &&
          /^[a-zA-Z0-9_]+$/.test(username)
        );
      };

      it('should validate correct usernames', () => {
        const validUsernames = [
          'testuser',
          'test_user',
          'testuser123',
          'user_123',
        ];

        validUsernames.forEach((username) => {
          expect(isValidUsername(username)).toBe(true);
        });
      });

      it('should reject invalid usernames', () => {
        const invalidUsernames = [
          'ab', // Too short
          'a'.repeat(31), // Too long
          'test-user', // Invalid character
          'test user', // Space
          'test@user', // Invalid character
          '',
        ];

        invalidUsernames.forEach((username) => {
          expect(isValidUsername(username)).toBe(false);
        });
      });
    });

    describe('Password Strength Validation', () => {
      const isStrongPassword = (password: string): boolean => {
        return (
          password.length >= 8 &&
          /[A-Z]/.test(password) &&
          /[a-z]/.test(password) &&
          /[0-9]/.test(password)
        );
      };

      it('should validate strong passwords', () => {
        const strongPasswords = ['Password123', 'MySecurePass1', 'Abc123456'];

        strongPasswords.forEach((password) => {
          expect(isStrongPassword(password)).toBe(true);
        });
      });

      it('should reject weak passwords', () => {
        const weakPasswords = [
          'password', // No uppercase or numbers
          'PASSWORD123', // No lowercase
          'Password', // No numbers
          'Pass1', // Too short
          '',
        ];

        weakPasswords.forEach((password) => {
          expect(isStrongPassword(password)).toBe(false);
        });
      });
    });
  });

  describe('Date and Time Utilities', () => {
    it('should format dates correctly', () => {
      const testDate = new Date('2025-07-02T12:00:00.000Z');
      const formattedDate = testDate.toISOString().split('T')[0];

      expect(formattedDate).toBe('2025-07-02');
    });

    it('should handle timezone conversions', () => {
      const testDate = new Date('2025-07-02T12:00:00.000Z');
      const utcString = testDate.toISOString();

      expect(utcString).toContain('2025-07-02');
      expect(utcString).toContain('T12:00:00');
    });

    it('should calculate date differences', () => {
      const date1 = new Date('2025-07-02');
      const date2 = new Date('2025-07-05');
      const diffInMs = date2.getTime() - date1.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      expect(diffInDays).toBe(3);
    });
  });

  describe('Error Handling Utilities', () => {
    it('should handle and format errors consistently', () => {
      const formatError = (error: any) => {
        return {
          message: error.message || 'Unknown error',
          status: error.status || 500,
          timestamp: new Date().toISOString(),
        };
      };

      const testError = new Error('Test error message');
      const formattedError = formatError(testError);

      expect(formattedError.message).toBe('Test error message');
      expect(formattedError.status).toBe(500);
      expect(formattedError.timestamp).toBeDefined();
    });

    it('should sanitize error messages for production', () => {
      const sanitizeError = (error: any, isProduction: boolean) => {
        if (isProduction) {
          return { message: 'Internal server error' };
        }
        return { message: error.message };
      };

      const testError = new Error('Sensitive database error with credentials');

      const devError = sanitizeError(testError, false);
      expect(devError.message).toBe(
        'Sensitive database error with credentials',
      );

      const prodError = sanitizeError(testError, true);
      expect(prodError.message).toBe('Internal server error');
    });
  });
});

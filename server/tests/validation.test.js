const { 
  validateRegistrationData, 
  validatePassword, 
  isValidEmail, 
  sanitizeString,
  validateTalkData,
  validateUserUpdateData
} = require('../src/utils/validation');

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    test('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    test('should reject invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('should validate strong passwords', () => {
      const result = validatePassword('StrongPass123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject weak passwords', () => {
      const shortPassword = validatePassword('Weak1');
      expect(shortPassword.isValid).toBe(false);
      expect(shortPassword.errors).toContain('Password must be at least 8 characters long');

      const noUppercase = validatePassword('lowercase123');
      expect(noUppercase.isValid).toBe(false);
      expect(noUppercase.errors).toContain('Password must contain at least one uppercase letter');

      const noLowercase = validatePassword('UPPERCASE123');
      expect(noLowercase.isValid).toBe(false);
      expect(noLowercase.errors).toContain('Password must contain at least one lowercase letter');

      const noNumber = validatePassword('NoNumbersHere');
      expect(noNumber.isValid).toBe(false);
      expect(noNumber.errors).toContain('Password must contain at least one number');
    });

    test('should reject invalid input types', () => {
      const nullPassword = validatePassword(null);
      expect(nullPassword.isValid).toBe(false);
      expect(nullPassword.errors).toContain('Password is required');

      const numberPassword = validatePassword(123456789);
      expect(numberPassword.isValid).toBe(false);
      expect(numberPassword.errors).toContain('Password is required');
    });
  });

  describe('sanitizeString', () => {
    test('should sanitize HTML and trim whitespace', () => {
      expect(sanitizeString('  <script>alert("xss")</script>  ')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
      expect(sanitizeString('  Normal text  ')).toBe('Normal text');
    });

    test('should limit string length', () => {
      const longString = 'a'.repeat(300);
      const result = sanitizeString(longString, 100);
      expect(result.length).toBe(100);
    });

    test('should handle invalid inputs', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(123)).toBe('');
      expect(sanitizeString('')).toBe('');
    });
  });

  describe('validateRegistrationData', () => {
    test('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'StrongPass123',
        displayName: 'Test User'
      };
      const result = validateRegistrationData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject invalid registration data', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'weak',
        displayName: 'x'
      };
      const result = validateRegistrationData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should handle missing required fields', () => {
      const result = validateRegistrationData({});
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valid email is required');
    });
  });

  describe('validateTalkData', () => {
    test('should validate correct talk data', () => {
      const validTalk = {
        title: 'Test Talk',
        description: 'This is a test talk description',
        location: 'Test Room',
        speakers: [{ name: 'Test Speaker', bio: 'Test Bio' }],
        startTime: new Date('2025-05-22T10:00:00'),
        endTime: new Date('2025-05-22T11:00:00')
      };
      const result = validateTalkData(validTalk);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject talks with missing required fields', () => {
      const invalidTalk = {
        title: 'A',
        description: 'Short'
      };
      const result = validateTalkData(invalidTalk);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should validate time constraints', () => {
      const invalidTalk = {
        title: 'Test Talk',
        description: 'This is a test talk description',
        location: 'Test Room',
        startTime: new Date('2025-05-22T11:00:00'),
        endTime: new Date('2025-05-22T10:00:00') // End before start
      };
      const result = validateTalkData(invalidTalk);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('End time must be after start time');
    });
  });

  describe('validateUserUpdateData', () => {
    test('should validate and sanitize user update data', () => {
      const updateData = {
        displayName: '  Test User  ',
        company: 'Test Company',
        jobTitle: 'Developer',
        photoURL: 'https://example.com/photo.jpg'
      };
      const result = validateUserUpdateData(updateData);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedData.displayName).toBe('Test User');
      expect(result.errors).toHaveLength(0);
    });

    test('should reject invalid photo URLs', () => {
      const updateData = {
        photoURL: 'not-a-url'
      };
      const result = validateUserUpdateData(updateData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Photo URL must be a valid URL');
    });

    test('should filter out non-allowed fields', () => {
      const updateData = {
        displayName: 'Test User',
        password: 'should-not-be-here',
        role: 'admin'
      };
      const result = validateUserUpdateData(updateData);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedData).not.toHaveProperty('password');
      expect(result.sanitizedData).not.toHaveProperty('role');
      expect(result.sanitizedData).toHaveProperty('displayName');
    });
  });
});
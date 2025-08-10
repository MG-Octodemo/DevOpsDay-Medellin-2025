const validator = require('validator');

/**
 * Common validation utilities for input sanitization and validation
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
exports.isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return validator.isEmail(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
exports.validatePassword = (password) => {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Sanitize string input
 * @param {string} input - Input string to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Sanitized string
 */
exports.sanitizeString = (input, maxLength = 255) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Remove HTML tags and trim whitespace
  const sanitized = validator.escape(input.trim());
  
  // Limit length
  return sanitized.length > maxLength ? sanitized.substring(0, maxLength) : sanitized;
};

/**
 * Validate registration data
 * @param {object} data - Registration data
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
exports.validateRegistrationData = (data) => {
  const errors = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Invalid registration data');
    return { isValid: false, errors };
  }
  
  const { email, password, displayName } = data;
  
  // Validate email
  if (!exports.isValidEmail(email)) {
    errors.push('Valid email is required');
  }
  
  // Validate password
  const passwordValidation = exports.validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }
  
  // Validate display name (optional but if provided must be valid)
  if (displayName !== undefined) {
    if (typeof displayName !== 'string' || displayName.trim().length < 2) {
      errors.push('Display name must be at least 2 characters long');
    }
    if (displayName.length > 100) {
      errors.push('Display name cannot exceed 100 characters');
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Validate talk data
 * @param {object} data - Talk data
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
exports.validateTalkData = (data) => {
  const errors = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Invalid talk data');
    return { isValid: false, errors };
  }
  
  const { title, description, speakers, startTime, endTime, location } = data;
  
  // Validate required fields
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Title is required and must be at least 3 characters long');
  }
  
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('Description is required and must be at least 10 characters long');
  }
  
  if (!location || typeof location !== 'string' || location.trim().length < 2) {
    errors.push('Location is required and must be at least 2 characters long');
  }
  
  // Validate speakers array
  if (speakers && !Array.isArray(speakers)) {
    errors.push('Speakers must be an array');
  } else if (speakers && speakers.length > 0) {
    speakers.forEach((speaker, index) => {
      if (!speaker || typeof speaker !== 'object') {
        errors.push(`Speaker ${index + 1} must be an object`);
      } else {
        if (!speaker.name || typeof speaker.name !== 'string' || speaker.name.trim().length < 2) {
          errors.push(`Speaker ${index + 1} name is required and must be at least 2 characters long`);
        }
      }
    });
  }
  
  // Validate dates
  if (startTime) {
    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      errors.push('Invalid start time format');
    }
  }
  
  if (endTime) {
    const end = new Date(endTime);
    if (isNaN(end.getTime())) {
      errors.push('Invalid end time format');
    }
  }
  
  if (startTime && endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      errors.push('End time must be after start time');
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Validate and sanitize user update data
 * @param {object} data - User update data
 * @returns {object} - { isValid: boolean, errors: string[], sanitizedData: object }
 */
exports.validateUserUpdateData = (data) => {
  const errors = [];
  const sanitizedData = {};
  
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Invalid user data'], sanitizedData: {} };
  }
  
  // Sanitize and validate allowed fields
  const allowedFields = ['displayName', 'company', 'jobTitle', 'photoURL'];
  
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      if (typeof data[field] !== 'string') {
        errors.push(`${field} must be a string`);
        continue;
      }
      
      // Special handling for photoURL - validate before sanitizing
      if (field === 'photoURL') {
        const trimmed = data[field].trim();
        if (trimmed && !validator.isURL(trimmed)) {
          errors.push('Photo URL must be a valid URL');
          continue;
        }
        if (trimmed) {
          sanitizedData[field] = trimmed;
        }
      } else {
        const sanitized = exports.sanitizeString(data[field], field === 'photoURL' ? 500 : 100);
        
        if (field === 'displayName' && sanitized.length < 2) {
          errors.push('Display name must be at least 2 characters long');
        } else if (sanitized) {
          sanitizedData[field] = sanitized;
        }
      }
    }
  }
  
  return { isValid: errors.length === 0, errors, sanitizedData };
};
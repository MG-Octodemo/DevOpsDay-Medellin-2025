/**
 * Common error handling utilities
 */

/**
 * Standard error response format
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {string} errorCode - Internal error code
 * @param {object} details - Additional error details (dev only)
 * @returns {object} - Formatted error response
 */
exports.createErrorResponse = (message, statusCode = 500, errorCode = null, details = null) => {
  const error = {
    success: false,
    message: message || 'Internal server error',
    statusCode,
    timestamp: new Date().toISOString()
  };
  
  if (errorCode) {
    error.errorCode = errorCode;
  }
  
  // Only include details in development
  if (details && process.env.NODE_ENV !== 'production') {
    error.details = details;
  }
  
  return error;
};

/**
 * Handle validation errors
 * @param {string[]} errors - Array of validation error messages
 * @returns {object} - Formatted validation error response
 */
exports.createValidationErrorResponse = (errors) => {
  return exports.createErrorResponse(
    'Validation failed',
    400,
    'VALIDATION_ERROR',
    { validationErrors: errors }
  );
};

/**
 * Handle authentication errors
 * @param {string} message - Custom error message
 * @returns {object} - Formatted authentication error response
 */
exports.createAuthErrorResponse = (message = 'Authentication failed') => {
  return exports.createErrorResponse(
    message,
    401,
    'AUTH_ERROR'
  );
};

/**
 * Handle authorization errors
 * @param {string} message - Custom error message
 * @returns {object} - Formatted authorization error response
 */
exports.createAuthorizationErrorResponse = (message = 'Access denied') => {
  return exports.createErrorResponse(
    message,
    403,
    'AUTHORIZATION_ERROR'
  );
};

/**
 * Handle not found errors
 * @param {string} resource - Resource name that was not found
 * @returns {object} - Formatted not found error response
 */
exports.createNotFoundErrorResponse = (resource = 'Resource') => {
  return exports.createErrorResponse(
    `${resource} not found`,
    404,
    'NOT_FOUND_ERROR'
  );
};

/**
 * Log error safely (sanitizing sensitive information)
 * @param {Error} error - Error object
 * @param {object} req - Express request object
 * @param {string} context - Additional context information
 */
exports.logError = (error, req = null, context = '') => {
  const timestamp = new Date().toISOString();
  const errorMessage = error.message || 'Unknown error';
  const stack = error.stack || 'No stack trace available';
  
  // Create safe request info (excluding sensitive data)
  const requestInfo = req ? {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user?.id || 'anonymous'
  } : {};
  
  console.error(`[${timestamp}] ERROR:`, {
    message: errorMessage,
    context,
    request: requestInfo,
    stack: process.env.NODE_ENV !== 'production' ? stack : undefined
  });
};

/**
 * Express error handling middleware
 * @param {Error} err - Error object
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
exports.errorHandler = (err, req, res, next) => {
  // Log the error
  exports.logError(err, req, 'Express error handler');
  
  // Determine status code
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal server error';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Authentication failed';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }
  
  // Don't expose internal errors in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal server error';
  }
  
  const errorResponse = exports.createErrorResponse(
    message,
    statusCode,
    err.code || null,
    process.env.NODE_ENV !== 'production' ? err.stack : null
  );
  
  res.status(statusCode).json(errorResponse);
};

/**
 * Handle async route errors
 * @param {function} fn - Async function to wrap
 * @returns {function} - Express route handler
 */
exports.asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Common HTTP status codes
 */
exports.HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};
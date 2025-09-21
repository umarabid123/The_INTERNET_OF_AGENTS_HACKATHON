/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large';
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 404 Not Found Middleware
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Async Error Handler Wrapper
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Rate Limiting Error Handler
 */
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    message: 'Too many requests, please try again later',
    retryAfter: req.rateLimit?.resetTime
  });
};

/**
 * API Error Class
 */
class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error Handler
 */
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(err => ({
    field: err.path,
    message: err.message
  }));

  return new ApiError(`Validation Error: ${errors.map(e => e.message).join(', ')}`, 400);
};

/**
 * Database Error Handler
 */
const handleDatabaseError = (error) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return new ApiError(`Duplicate ${field} value`, 400);
  }

  if (error.name === 'CastError') {
    return new ApiError('Invalid ID format', 400);
  }

  return new ApiError('Database error', 500);
};

/**
 * External API Error Handler
 */
const handleExternalApiError = (error, apiName) => {
  console.error(`${apiName} API Error:`, error);
  
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || `${apiName} API error`;
    
    if (status === 401) {
      return new ApiError(`${apiName} authentication failed`, 500);
    }
    
    if (status === 429) {
      return new ApiError(`${apiName} rate limit exceeded`, 429);
    }
    
    if (status >= 500) {
      return new ApiError(`${apiName} service unavailable`, 503);
    }
    
    return new ApiError(message, status);
  }
  
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return new ApiError(`${apiName} service unavailable`, 503);
  }
  
  return new ApiError(`${apiName} integration error`, 500);
};

/**
 * Log errors for monitoring
 */
const logError = (error, req = null) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...(req && {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id
    })
  };

  // In production, send to logging service
  console.error('Application Error:', errorInfo);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
  rateLimitHandler,
  ApiError,
  handleValidationError,
  handleDatabaseError,
  handleExternalApiError,
  logError
};
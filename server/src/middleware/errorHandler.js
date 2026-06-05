const { ZodError } = require('zod');
const { ApiError } = require('../utils/apiError');

function errorHandler(error, req, res, next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  if (error?.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate record found'
    });
  }

  const statusCode = error?.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error?.message || 'Internal server error'
  });
}

module.exports = { errorHandler };
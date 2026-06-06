const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { ApiError } = require('../utils/apiError');

function adminAuth(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Unauthorized'));
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (decoded.role !== 'admin') {
      return next(new ApiError(401, 'Unauthorized'));
    }
    req.admin = decoded;
    return next();
  } catch (error) {
    return next(new ApiError(401, 'Unauthorized'));
  }
}

module.exports = { adminAuth };
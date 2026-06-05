const { env } = require('../config/env');
const { ApiError } = require('../utils/apiError');

function adminAuth(req, res, next) {
  const password = req.header('x-admin-password');

  if (!password || password !== env.adminPassword) {
    return next(new ApiError(401, 'Unauthorized'));
  }

  return next();
}

module.exports = { adminAuth };
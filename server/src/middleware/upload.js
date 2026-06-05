const multer = require('multer');
const { ApiError } = require('../utils/apiError');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 5
  }
});

function requireJerseyImages(req, res, next) {
  const files = req.files || {};
  const uploadedImages = Object.values(files).flatMap((group) => group || []);

  if (uploadedImages.length === 0) {
    return next(new ApiError(400, 'At least one image is required'));
  }

  if (uploadedImages.length > 5) {
    return next(new ApiError(400, 'Maximum 5 images are allowed'));
  }

  return next();
}

function requireJerseyUpdatePayload(req, res, next) {
  const files = req.files || {};
  const hasAnyImage = Object.values(files).some((group) => Array.isArray(group) && group.length > 0);
  const hasBodyField = Object.values(req.body || {}).some((value) => value !== undefined && value !== '');

  if (!hasAnyImage && !hasBodyField) {
    return next(new ApiError(400, 'Provide at least one field or image to update'));
  }

  return next();
}

module.exports = {
  upload,
  requireJerseyImages,
  requireJerseyUpdatePayload
};
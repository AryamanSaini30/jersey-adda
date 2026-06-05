const { Router } = require('express');
const jerseyController = require('../controllers/jersey.controller');
const { adminAuth } = require('../middleware/adminAuth');
const { validate } = require('../middleware/validate');
const { upload, requireJerseyImages, requireJerseyUpdatePayload } = require('../middleware/upload');
const {
  jerseyListQuerySchema,
  jerseyCreateSchema,
  jerseyUpdateSchema,
  jerseyIdParamsSchema,
  jerseySlugParamsSchema
} = require('../validations/jersey.validation');

const router = Router();
const multiImageUpload = upload.fields([
  { name: 'image_1', maxCount: 1 },
  { name: 'image_2', maxCount: 1 },
  { name: 'image_3', maxCount: 1 },
  { name: 'image_4', maxCount: 1 },
  { name: 'image_5', maxCount: 1 }
]);

router.get('/jerseys', validate(jerseyListQuerySchema, 'query'), jerseyController.listJerseys);
router.get('/jerseys/:slug', validate(jerseySlugParamsSchema, 'params'), jerseyController.getJerseyBySlug);

router.post(
  '/admin/jerseys',
  adminAuth,
  multiImageUpload,
  validate(jerseyCreateSchema),
  requireJerseyImages,
  jerseyController.createJersey
);

router.put(
  '/admin/jerseys/:id',
  adminAuth,
  validate(jerseyIdParamsSchema, 'params'),
  multiImageUpload,
  validate(jerseyUpdateSchema),
  requireJerseyUpdatePayload,
  jerseyController.updateJersey
);

router.delete(
  '/admin/jerseys/:id',
  adminAuth,
  validate(jerseyIdParamsSchema, 'params'),
  jerseyController.deleteJersey
);

router.post('/admin/verify', adminAuth, (req, res) => {
  res.json({ success: true });
});

module.exports = router;
const { Router } = require('express');
const { settingsController } = require('../controllers/settings.controller');
const { adminAuth } = require('../middleware/adminAuth');

const router = Router();

router.get('/', settingsController.getSettings);
router.put('/', adminAuth, settingsController.updateSettings);

module.exports = router;

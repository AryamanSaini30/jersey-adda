const { Router } = require('express');
const jerseyRoutes = require('./jersey.routes');
const customerRoutes = require('./customer.routes');
const orderRoutes = require('./order.routes');
const settingsRoutes = require('./settings.routes');

const router = Router();

router.use('/', jerseyRoutes);
router.use('/customers', customerRoutes);
router.use('/orders', orderRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
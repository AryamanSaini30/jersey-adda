const { Router } = require('express');
const { orderController } = require('../controllers/order.controller');

const router = Router();

router.post('/', orderController.createOrder);

module.exports = router;

const { Router } = require('express');
const { customerController } = require('../controllers/customer.controller');

const router = Router();

router.get('/phone/:phone', customerController.findCustomerByPhone);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);

module.exports = router;

const asyncHandler = require('../middleware/asyncHandler');
const { orderService } = require('../services/order.service');
const { ApiResponse } = require('../utils/apiResponse');

const createOrder = asyncHandler(async (req, res) => {
  const { order, whatsappUrl } = await orderService.createOrder(req.body);
  res.status(201).json(new ApiResponse(201, { order, whatsappUrl }, 'Order created successfully'));
});

const orderController = {
  createOrder,
};

module.exports = { orderController };

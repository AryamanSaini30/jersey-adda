const asyncHandler = require('../middleware/asyncHandler');
const { customerService } = require('../services/customer.service');
const { ApiResponse } = require('../utils/apiResponse');
const { ApiError } = require('../utils/apiError');

const findCustomerByPhone = asyncHandler(async (req, res) => {
  const { phone } = req.params;
  const customer = await customerService.findCustomerByPhone(phone);
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }
  res.status(200).json(new ApiResponse(200, customer));
});

const createCustomer = asyncHandler(async (req, res) => {
  const { name, phone, address_line_1, city, state, postal_code } = req.body;
  if (!name || !name.trim() ||
      !phone || !phone.trim() ||
      !address_line_1 || !address_line_1.trim() ||
      !city || !city.trim() ||
      !state || !state.trim() ||
      !postal_code || !postal_code.trim()) {
    throw new ApiError(400, 'Required fields are not filled');
  }
  const newCustomer = await customerService.createCustomer(req.body);
  res.status(201).json(new ApiResponse(201, newCustomer, 'Customer created successfully'));
});

const updateCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, address_line_1, city, state, postal_code } = req.body;
  if (!name || !name.trim() ||
      !address_line_1 || !address_line_1.trim() ||
      !city || !city.trim() ||
      !state || !state.trim() ||
      !postal_code || !postal_code.trim()) {
    throw new ApiError(400, 'Required fields are not filled');
  }
  const updatedCustomer = await customerService.updateCustomer(id, req.body);
  res.status(200).json(new ApiResponse(200, updatedCustomer, 'Customer updated successfully'));
});

const customerController = {
  findCustomerByPhone,
  createCustomer,
  updateCustomer,
};

module.exports = { customerController };

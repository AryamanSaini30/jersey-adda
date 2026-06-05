const Customer = require('../models/customer.model');

const findCustomerByPhone = async (phone) => {
  return Customer.findByPhone(phone);
};

const createCustomer = async (customerData) => {
  return Customer.create(customerData);
};

const updateCustomer = async (id, customerData) => {
  return Customer.update(id, customerData);
};

const customerService = {
  findCustomerByPhone,
  createCustomer,
  updateCustomer,
};

module.exports = { customerService };

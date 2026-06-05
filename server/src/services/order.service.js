const Order = require('../models/order.model');
const Settings = require('../models/settings.model');

const createOrder = async (orderPayload) => {
  const { customer, cart, totalAmount } = orderPayload;

  const orderNumber = await Order.getNextOrderNumber();

  const orderData = {
    order_number: orderNumber,
    customer_id: customer.id,
    shipping_name: customer.name,
    shipping_phone: customer.phone,
    shipping_address: `${customer.address_line_1}${customer.address_line_2 ? ', ' + customer.address_line_2 : ''}, ${customer.city}, ${customer.state} - ${customer.postal_code}`,
    total_amount: totalAmount,
  };

  const newOrder = await Order.create(orderData, cart);

  const settings = await Settings.get();
  const whatsappNumber = settings.whatsapp_number;

  const message = generateWhatsAppMessage(newOrder, customer);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;

  return { order: newOrder, whatsappUrl };
};

const generateWhatsAppMessage = (order, customer) => {
  const items = order.items
    .map(
      (item) =>
        `- ${item.jersey_name} (${item.size}) x ${item.quantity} - Price: ₹${Number(item.price).toLocaleString('en-IN')}`
    )
    .join('\n');

  const total = `₹${Number(order.total_amount).toLocaleString('en-IN')}`;

  return `🛒 *NEW ORDER RECEIVED!*\n\n*Order Number:* ${
    order.order_number
  }\n\n*Customer Details:*\n- *Name:* ${customer.name}\n- *Phone:* ${customer.phone}\n- *Shipping Address:*\n${customer.address_line_1}${customer.address_line_2 ? '\n' + customer.address_line_2 : ''}\n${customer.city}, ${customer.state} - ${customer.postal_code}\n\n*Items Ordered:*\n${items}\n\n*Total Amount:* ${total}\n\nStatus: Pending confirmation.`;
};

const orderService = {
  createOrder,
};

module.exports = { orderService };

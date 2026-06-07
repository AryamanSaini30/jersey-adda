const Order = require('../models/order.model');
const Settings = require('../models/settings.model');

const defaultWhatsAppTemplate = `DETAILS
ORDER NO:- {{order_number}}
NAME: {{customer_name}}
PH No:- {{customer_phone}}
ADDRESS:- {{customer_address}}
PINCODE:- {{postal_code}}
JERSEY:- {{order_items}}
TOTAL:- ₹{{total_amount}}
DATE:- {{order_date}}`;

const renderTemplate = (template, values) => {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    return values[key] ?? '';
  });
};

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

  const message = generateWhatsAppMessage(newOrder, customer, settings);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;

  return { order: newOrder, whatsappUrl };
};

const generateWhatsAppMessage = (order, customer, settings) => {
  const items = order.items
    .map(
      (item) =>
        `- ${item.jersey_name} (${item.size}) x ${item.quantity} - Price: ₹${Number(item.price).toLocaleString('en-IN')}`
    )
    .join('\n');

  const total = `₹${Number(order.total_amount).toLocaleString('en-IN')}`;
  const customerAddress = `${customer.address_line_1}${customer.address_line_2 ? '\n' + customer.address_line_2 : ''}\n${customer.city}, ${customer.state} - ${customer.postal_code}`;
  const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN');

  const template = settings?.whatsapp_message_template || defaultWhatsAppTemplate;
  return renderTemplate(template, {
    order_number: order.order_number,
    customer_name: customer.name,
    customer_phone: customer.phone,
    customer_address: customerAddress,
    postal_code: customer.postal_code,
    order_items: items,
    total_amount: total,
    order_date: orderDate,
  });
};

const orderService = {
  createOrder,
};

module.exports = { orderService };

const supabase = require('../config/supabase');

const Order = {
  async create(orderData, items) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);

    const orderItems = items.map((item) => ({
      order_id: order.id,
      jersey_id: item.id,
      jersey_name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // If items fail, we should probably delete the order
      await supabase.from('orders').delete().eq('id', order.id);
      throw new Error(itemsError.message);
    }

    return { ...order, items: orderItems };
  },

  async getOrderById(id) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, jerseys(*))')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async getNextOrderNumber() {
    const { data, error } = await supabase
      .from('orders')
      .select('order_number')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }

    if (!data) {
      return 'ORD-10001';
    }

    const lastOrderNumber = data.order_number;
    const lastNumber = parseInt(lastOrderNumber.split('-')[1], 10);
    const nextNumber = Math.max(lastNumber + 1, 10001);
    return `ORD-${nextNumber}`;
  },
};

module.exports = Order;

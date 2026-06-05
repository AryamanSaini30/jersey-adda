import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-red-600">No order details found.</h1>
        <Link to="/" className="text-blue-600 mt-4 inline-block">Go to Homepage</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 max-w-2xl mx-auto rounded-md shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-lg mb-2">Your Order Number is: <span className="font-semibold">{order.order_number}</span></p>
        <p className="mb-6">Our team will verify availability and contact you on WhatsApp shortly.</p>
        <Link to="/jerseys" className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

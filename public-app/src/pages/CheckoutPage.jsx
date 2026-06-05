import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { http } from '../api/http';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [customer, setCustomer] = useState(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
  });

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await http.get(`/customers/phone/${phone}`);
      setCustomer(response.data);
      setFormData(response.data);
      setIsNewCustomer(false);
    } catch (error) {
      if (error.message === 'Customer not found') {
        setIsNewCustomer(true);
        setCustomer(null);
      } else {
        toast.error('An error occurred while fetching customer data.');
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    if (!customer || isNewCustomer) return;
    try {
      const response = await http.put(`/customers/${customer.id}`, formData);
      setCustomer(response.data);
      toast.success('Customer profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update customer profile.');
    }
  };

  const handlePlaceOrder = async () => {
    let finalCustomer = customer;
    if (isNewCustomer) {
      try {
        const response = await http.post('/customers', { ...formData, phone });
        finalCustomer = response.data;
        setCustomer(finalCustomer);
        setIsNewCustomer(false);
        toast.success('New customer profile created!');
      } catch (error) {
        toast.error('Failed to create customer profile.');
        return;
      }
    }

    if (!finalCustomer) {
      toast.error('Please provide customer details.');
      return;
    }

    try {
      const orderPayload = {
        customer: {
          ...finalCustomer,
          name: formData.name,
          address_line_1: formData.address_line_1,
          address_line_2: formData.address_line_2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
        },
        cart,
        totalAmount: cartTotal,
      };
      const response = await http.post('/orders', orderPayload);
      const { whatsappUrl, order } = response.data;
      
      clearCart();
      navigate('/order-success', { state: { order } });
      window.location.href = whatsappUrl;

    } catch (error) {
      toast.error('Failed to place order.');
    }
  };

  const hasProfileChanges = customer && (
    formData.name !== customer.name ||
    formData.address_line_1 !== customer.address_line_1 ||
    (formData.address_line_2 || '') !== (customer.address_line_2 || '') ||
    formData.city !== customer.city ||
    formData.state !== customer.state ||
    formData.postal_code !== customer.postal_code
  );

  if (cart.length === 0) {
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-2xl">Your cart is empty.</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Customer Information</h2>
            <form onSubmit={handlePhoneSubmit} className="flex gap-4">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="flex-grow p-2 border rounded-md"
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md">
                Find
              </button>
            </form>
          </div>

          {(customer || isNewCustomer) && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {isNewCustomer ? 'Create New Profile' : 'Shipping Details'}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="p-2 border rounded-md" />
                <input type="text" name="address_line_1" value={formData.address_line_1} onChange={handleInputChange} placeholder="Address Line 1" className="p-2 border rounded-md" />
                <input type="text" name="address_line_2" value={formData.address_line_2} onChange={handleInputChange} placeholder="Address Line 2" className="p-2 border rounded-md" />
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="p-2 border rounded-md" />
                <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="p-2 border rounded-md" />
                <input type="text" name="postal_code" value={formData.postal_code} onChange={handleInputChange} placeholder="Postal Code" className="p-2 border rounded-md" />
              </div>
              {customer && !isNewCustomer && hasProfileChanges && (
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                  Save Profile Changes
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">2. Order Summary</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            {cart.map(item => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between items-center mb-2">
                <p>{item.name} (x{item.quantity})</p>
                <p>{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
            <div className="flex justify-between font-bold text-xl border-t pt-4 mt-4">
              <p>Total</p>
              <p>{formatCurrency(cartTotal)}</p>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 text-white py-3 rounded-md mt-6 hover:bg-green-700"
              disabled={!customer && !isNewCustomer}
            >
              Place Order & Send on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

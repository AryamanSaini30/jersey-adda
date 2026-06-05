import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { getPrimaryJerseyImage } from '../utils/image';

const CartPage = () => {
  const { cart, cartTotal, totalItems, removeFromCart, updateQuantity } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">Your cart is empty.</p>
          <Link to="/jerseys" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex items-center border-b py-4">
                <img src={getPrimaryJerseyImage(item)} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-6" />
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-500">Size: {item.size}</p>
                  <p className="text-gray-600">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center">
                  <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="px-3 py-1 border rounded-md">-</button>
                  <span className="px-4">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="px-3 py-1 border rounded-md">+</button>
                </div>
                <div className="text-lg font-semibold mx-6">
                  {formatCurrency(item.price * item.quantity)}
                </div>
                <button onClick={() => removeFromCart(item.id, item.size)} className="text-red-500 hover:text-red-700">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <p>Total Items</p>
              <p>{totalItems}</p>
            </div>
            <div className="flex justify-between font-bold text-xl border-t pt-4 mt-4">
              <p>Estimated Total</p>
              <p>{formatCurrency(cartTotal)}</p>
            </div>
            <Link to="/checkout" className="block text-center w-full bg-green-600 text-white py-3 rounded-md mt-6 hover:bg-green-700">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

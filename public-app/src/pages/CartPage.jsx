import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { getPrimaryJerseyImage } from '../utils/image';
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const { cart, cartTotal, totalItems, removeFromCart, updateQuantity } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-xl mx-auto px-6">
          <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-600">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Looks like you haven't added any jerseys yet. Explore our collection to find your favorite team's kit!
          </p>
          <Link to="/jerseys" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
            {cart.map((item) => (
              <div 
                key={`${item.id}-${item.size}`} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 border-b border-gray-100 last:border-b-0 last:pb-0 first:pt-0 gap-4"
              >
                {/* Product details header */}
                <div className="flex items-center gap-4 sm:gap-6 flex-grow">
                  <img 
                    src={getPrimaryJerseyImage(item)} 
                    alt={item.name} 
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-gray-100 bg-gray-50 shrink-0" 
                  />
                  <div className="flex-grow">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">{item.name}</h2>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
                      <span>Size: <strong className="text-gray-900">{item.size}</strong></span>
                      <span>•</span>
                      <span>Unit Price: <strong className="text-gray-900">{formatCurrency(item.price)}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Pricing, Quantity, and Actions */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50 shadow-inner">
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} 
                      className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 text-lg font-medium transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-bold text-gray-900 min-w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} 
                      className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 text-lg font-medium transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-base sm:text-lg font-extrabold text-gray-900 min-w-[90px] text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.id, item.size)} 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-full transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Panel */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Total Items</span>
                <span className="font-semibold text-gray-900">{totalItems}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery</span>
                <span className="font-semibold text-brand-600 text-xs sm:text-sm">Will be specified on WhatsApp</span>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-black text-brand-700">{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            <Link 
              to="/checkout" 
              className="block text-center w-full btn-primary mt-8 py-3.5 text-base font-bold shadow-md shadow-brand-700/10 hover:shadow-lg transition-all"
            >
              Proceed to Checkout
            </Link>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;

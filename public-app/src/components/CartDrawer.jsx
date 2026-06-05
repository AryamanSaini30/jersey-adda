import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { getPrimaryJerseyImage } from '../utils/image';
import BrandLogo from './BrandLogo';

const CartDrawer = () => {
  const { isCartOpen, toggleCart, cart, cartTotal, removeFromCart, updateQuantity } = useCart();

  return (
    <>
      {/* Backdrop overlay */}
      {isCartOpen && (
        <div 
          onClick={toggleCart}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300"
        />
      )}
      {/* Slide-out drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
      >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <BrandLogo showWordmark={false} compact />
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button onClick={toggleCart} className="text-gray-500 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-4">
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex items-center mb-4">
                <img src={getPrimaryJerseyImage(item)} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                  <p className="text-sm">{formatCurrency(item.price)}</p>
                  <div className="flex items-center mt-2">
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="px-2 py-1 border rounded-md">-</button>
                    <span className="px-4">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="px-2 py-1 border rounded-md">+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id, item.size)} className="text-red-500 hover:text-red-700 ml-4">
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t">
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Subtotal</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
          <Link to="/cart" onClick={toggleCart} className="block text-center w-full btn-secondary mt-4 py-3">
            View Cart
          </Link>
          <Link to="/checkout" onClick={toggleCart} className="block text-center w-full btn-primary mt-2 py-3">
            Checkout
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default CartDrawer;

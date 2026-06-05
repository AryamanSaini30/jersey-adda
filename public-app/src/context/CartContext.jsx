import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (jersey, size) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === jersey.id && item.size === size
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === jersey.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...jersey, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (jerseyId, size) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === jerseyId && item.size === size))
    );
  };

  const updateQuantity = (jerseyId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(jerseyId, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === jerseyId && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    toggleCart,
    cartTotal,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

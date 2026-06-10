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

  const addToCart = (jersey, size, quantityToAdd = 1) => {
    const itemPrice = jersey.is_on_sale ? Number(jersey.sale_price) : Number(jersey.price);
    const itemToAdd = {
      ...jersey,
      price: itemPrice,
      size,
      quantity: quantityToAdd
    };

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === jersey.id && item.size === size
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === jersey.id && item.size === size
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prevCart, itemToAdd];
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

  const ITEMS_TOTAL = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const DELIVERY_COST = 99; // fixed delivery charge in INR
  const cartTotal = ITEMS_TOTAL + (cart.length > 0 ? DELIVERY_COST : 0);
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
    itemsTotal: ITEMS_TOTAL,
    deliveryCost: cart.length > 0 ? DELIVERY_COST : 0,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

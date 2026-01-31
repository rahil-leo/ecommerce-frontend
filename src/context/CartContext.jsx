import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '@services';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart items from localStorage on mount
    const items = cartService.getCartItems();
    setCartItems(items);
  }, []);

  const addToCart = (product, quantity = 1) => {
    const updatedCart = cartService.addItem(product, quantity);
    setCartItems(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartService.removeItem(productId);
    setCartItems(updatedCart);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cartService.updateQuantity(productId, quantity);
    setCartItems(updatedCart);
  };

  const clearCart = () => {
    const updatedCart = cartService.clearCart();
    setCartItems(updatedCart);
  };

  const getCartTotal = () => {
    return cartService.getCartTotal(cartItems);
  };

  const getCartItemsCount = () => {
    return cartService.getCartItemsCount(cartItems);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => (item.id || item._id) === productId);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;

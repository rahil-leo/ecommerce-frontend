import { STORAGE_KEYS } from '@constants';

export const cartService = {
  // Get cart items from localStorage
  getCartItems: () => {
    const cartData = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
    return cartData ? JSON.parse(cartData) : [];
  },

  // Save cart items to localStorage
  saveCartItems: (items) => {
    localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(items));
  },

  // Add item to cart
  addItem: (product, quantity = 1) => {
    const cartItems = cartService.getCartItems();
    const productId = product.id || product._id;
    const existingItem = cartItems.find(item => (item.id || item._id) === productId);

    let updatedCart;
    if (existingItem) {
      updatedCart = cartItems.map(item =>
        (item.id || item._id) === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, id: productId, quantity }];
    }

    cartService.saveCartItems(updatedCart);
    return updatedCart;
  },

  // Remove item from cart
  removeItem: (productId) => {
    const cartItems = cartService.getCartItems();
    const updatedCart = cartItems.filter(item => (item.id || item._id) !== productId);
    cartService.saveCartItems(updatedCart);
    return updatedCart;
  },

  // Update item quantity
  updateQuantity: (productId, quantity) => {
    const cartItems = cartService.getCartItems();
    const updatedCart = cartItems.map(item =>
      (item.id || item._id) === productId ? { ...item, quantity } : item
    );
    cartService.saveCartItems(updatedCart);
    return updatedCart;
  },

  // Clear cart
  clearCart: () => {
    localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
    return [];
  },

  // Get cart total
  getCartTotal: (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  // Get cart items count
  getCartItemsCount: (items) => {
    return items.reduce((count, item) => count + item.quantity, 0);
  },
};

export default cartService;

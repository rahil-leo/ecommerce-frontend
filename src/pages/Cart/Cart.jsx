import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '@context/CartContext';
import { Button, Card, Alert } from '@components/common';
import { ROUTES } from '@constants';
import styles from './Cart.module.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [stockError, setStockError] = useState(null);

  const handleQuantityChange = (productId, newQuantity, maxStock) => {
    if (newQuantity < 1) return;
    if (newQuantity > maxStock) {
      setStockError(`Only ${maxStock} items available in stock`);
      setTimeout(() => setStockError(null), 3000);
      return;
    }
    setStockError(null);
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    navigate(ROUTES.CHECKOUT);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className={styles.emptyCart}>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Button onClick={() => navigate(ROUTES.PRODUCTS)} size="large">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.cart}>
        <div className={styles.header}>
          <h1 className={styles.title}>Shopping Cart</h1>
          <Button variant="outline" onClick={clearCart} size="small">
            Clear Cart
          </Button>
        </div>

        {stockError && (
          <Alert type="error" message={stockError} autoClose onClose={() => setStockError(null)} />
        )}

        <div className={styles.content}>
          <div className={styles.items}>
            {cartItems.map((item) => (
              <Card key={item.id || item._id} padding="medium" className={styles.cartItem}>
                <img src={item.images?.[0]?.url || item.image} alt={item.name || item.title} className={styles.itemImage} />
                
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemTitle}>{item.name || item.title}</h3>
                  <p className={styles.itemCategory}>{item.category?.name || item.category}</p>
                  <p className={styles.itemPrice}>${item.price}</p>
                  {item.stock && (
                    <p className={styles.itemStock}>
                      {item.stock < 5 ? (
                        <span style={{color: '#f44336'}}>Only {item.stock} left in stock</span>
                      ) : (
                        <span style={{color: '#4caf50'}}>{item.stock} in stock</span>
                      )}
                    </p>
                  )}
                </div>

                <div className={styles.itemActions}>
                  <div className={styles.quantityControl}>
                    <button
                      onClick={() => handleQuantityChange(item.id || item._id, item.quantity - 1, item.stock)}
                      className={styles.quantityButton}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id || item._id, item.quantity + 1, item.stock)}
                      className={styles.quantityButton}
                      disabled={item.quantity >= item.stock}
                      style={{opacity: item.quantity >= item.stock ? 0.5 : 1, cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer'}}
                    >
                      +
                    </button>
                  </div>

                  <div className={styles.itemTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => removeFromCart(item.id || item._id)}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className={styles.summary}>
            <Card padding="large">
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              
              <div className={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Shipping:</span>
                <span>Free</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Tax:</span>
                <span>$0.00</span>
              </div>

              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              <Button onClick={handleCheckout} size="large" fullWidth>
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate(ROUTES.PRODUCTS)}
              >
                Continue Shopping
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

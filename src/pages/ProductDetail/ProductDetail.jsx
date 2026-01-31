import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader, Alert } from '@components/common';
import { useCart } from '@context/CartContext';
import { productService } from '@services';
import { ROUTES } from '@constants';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // Check if product is already in cart
    const existingCartItem = cartItems.find(item => (item.id || item._id) === (product.id || product._id));
    const currentCartQuantity = existingCartItem ? existingCartItem.quantity : 0;
    const totalQuantity = currentCartQuantity + quantity;

    if (totalQuantity > product.stock) {
      setError(`Cannot add ${quantity} more. You already have ${currentCartQuantity} in cart. Only ${product.stock} available in stock.`);
      setTimeout(() => setError(null), 5000);
      return;
    }

    if (quantity > product.stock) {
      setError(`Only ${product.stock} items available in stock`);
      setTimeout(() => setError(null), 3000);
      return;
    }
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const incrementQuantity = () => {
    const existingCartItem = cartItems.find(item => (item.id || item._id) === (product.id || product._id));
    const currentCartQuantity = existingCartItem ? existingCartItem.quantity : 0;
    const totalQuantity = currentCartQuantity + quantity + 1;

    if (totalQuantity > product.stock) {
      setError(`Cannot add more. You have ${currentCartQuantity} in cart. Only ${product.stock} available total.`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (quantity >= product.stock) {
      setError(`Only ${product.stock} items available in stock`);
      setTimeout(() => setError(null), 3000);
      return;
    }
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  if (loading) {
    return <Loader fullScreen message="Loading product..." />;
  }

  if (error) {
    return (
      <div className="container">
        <Alert type="error" message={error} />
        <Button onClick={() => navigate(ROUTES.PRODUCTS)}>Back to Products</Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <p>Product not found</p>
        <Button onClick={() => navigate(ROUTES.PRODUCTS)}>Back to Products</Button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.productDetail}>
        <Button variant="ghost" onClick={() => navigate(ROUTES.PRODUCTS)} className={styles.backButton}>
          ← Back to Products
        </Button>

        {addedToCart && (
          <Alert 
            type="success" 
            message="Product added to cart!" 
            autoClose 
            onClose={() => setAddedToCart(false)}
          />
        )}

        <div className={styles.content}>
          <div className={styles.imageSection}>
            <img src={product.images?.[0]?.url || product.image} alt={product.name || product.title} className={styles.image} />
          </div>

          <div className={styles.infoSection}>
            <div className={styles.category}>{product.category?.name || product.category}</div>
            <h1 className={styles.title}>{product.name || product.title}</h1>
            
            <div className={styles.rating}>
              ⭐ {product.rating?.rate || 4.5} ({product.rating?.count || 0} reviews)
            </div>

            <div className={styles.price}>${product.price}</div>

            <div className={styles.stock}>
              {(() => {
                const cartItem = cartItems.find(item => (item.id || item._id) === (product.id || product._id));
                const inCart = cartItem ? cartItem.quantity : 0;
                const remaining = product.stock - inCart;
                
                if (remaining <= 0) {
                  return <span className={styles.outOfStock}>Out of Stock {inCart > 0 && `(${inCart} in your cart)`}</span>;
                } else if (remaining < 5) {
                  return <span className={styles.lowStock}>Only {remaining} left! {inCart > 0 && `(${inCart} already in cart)`}</span>;
                } else {
                  return <span className={styles.inStock}>{remaining} available {inCart > 0 && `(${inCart} in cart)`}</span>;
                }
              })()}
            </div>

            <div className={styles.description}>
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className={styles.actions}>
              <div className={styles.quantitySelector}>
                <button onClick={decrementQuantity} className={styles.quantityButton}>
                  -
                </button>
                <span className={styles.quantity}>{quantity}</span>
                <button onClick={incrementQuantity} className={styles.quantityButton}>
                  +
                </button>
              </div>

              {(() => {
                const cartItem = cartItems.find(item => (item.id || item._id) === (product.id || product._id));
                const inCart = cartItem ? cartItem.quantity : 0;
                const remaining = product.stock - inCart;
                
                return (
                  <Button 
                    onClick={handleAddToCart} 
                    size="large" 
                    fullWidth
                    disabled={remaining <= 0 || quantity > remaining}
                  >
                    {remaining <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

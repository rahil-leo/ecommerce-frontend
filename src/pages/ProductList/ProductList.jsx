import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Loader, Button, Alert } from '@components/common';
import { useCart } from '@context/CartContext';
import { productService } from '@services';
import { ROUTES, CATEGORIES } from '@constants';
import styles from './ProductList.module.css';

const ProductList = () => {
  const { cartItems } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return <Loader fullScreen message="Loading products..." />;
  }

  return (
    <div className="container">
      <div className={styles.productList}>
        <h1 className={styles.title}>Our Products</h1>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {/* Filters */}
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />

          <div className={styles.categories}>
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`${styles.categoryButton} ${
                  selectedCategory === category.id ? styles.active : ''
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className={styles.noProducts}>
            <p>No products found</p>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => {
              // Calculate remaining stock based on cart items
              const cartItem = cartItems.find(item => (item.id || item._id) === product._id);
              const remainingStock = product.stock - (cartItem ? cartItem.quantity : 0);
              const isOutOfStock = remainingStock <= 0;

              return (
                <Card key={product._id} padding="none" hover className={`${styles.productCard} ${isOutOfStock ? styles.outOfStock : ''}`}>
                  <Link to={`${ROUTES.PRODUCTS}/${product._id}`} className={styles.productLink}>
                    {isOutOfStock && (
                      <div className={styles.outOfStockBadge}>Out of Stock</div>
                    )}
                    <div className={styles.imageWrapper}>
                      <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                        alt={product.name}
                        className={styles.productImage}
                        style={{opacity: isOutOfStock ? 0.5 : 1}}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productTitle}>{product.name}</h3>
                      <p className={styles.productCategory}>{product.category?.name || 'Uncategorized'}</p>
                      {!isOutOfStock && remainingStock < 5 && (
                        <p className={styles.lowStockWarning}>Only {remainingStock} left!</p>
                      )}
                      <div className={styles.productFooter}>
                        <span className={styles.productPrice}>${product.price}</span>
                        <div className={styles.productRating}>
                          ⭐ {product.rating || 0} ({product.numReviews || 0})
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductSection.module.css';
import Card from '../Card/Card';
import Loader from '../Loader/Loader';

const ProductSection = ({ 
  category, 
  products = [],
  loading = false,
  onViewAll
}) => {
  const navigate = useNavigate();

  if (loading) {
    return <Loader />;
  }

  if (!category || products.length === 0) {
    return null;
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate(`/category/${category.slug}`);
    }
  };

  return (
    <section className={styles.section} style={{ borderTopColor: category.color }}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <span className={styles.icon}>{category.icon}</span>
          <h2 className={styles.title}>{category.name}</h2>
        </div>
        <button className={styles.viewAllBtn} onClick={handleViewAll}>
          View All →
        </button>
      </div>

      <div className={styles.productsGrid}>
        {products.slice(0, 6).map((product) => (
          <Card
            key={product._id}
            className={styles.productCard}
            onClick={() => handleProductClick(product._id)}
            hover
          >
            <div className={styles.imageContainer}>
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0].url} 
                  alt={product.name}
                  className={styles.image}
                />
              ) : (
                <div className={styles.noImage}>No Image</div>
              )}
              {product.stock === 0 && (
                <div className={styles.outOfStock}>Out of Stock</div>
              )}
            </div>

            <div className={styles.details}>
              <h3 className={styles.name}>{product.name}</h3>
              
              {product.category && (
                <p className={styles.category}>{product.category.name}</p>
              )}

              <div className={styles.priceContainer}>
                <span className={styles.price}>${product.price}</span>
                {product.originalPrice && (
                  <span className={styles.originalPrice}>
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {product.rating > 0 && (
                <div className={styles.rating}>
                  <span className={styles.stars}>★ {product.rating.toFixed(1)}</span>
                  <span className={styles.reviews}>({product.numReviews})</span>
                </div>
              )}

              {product.stock > 0 && product.stock < 5 && (
                <p className={styles.lowStock}>Only {product.stock} left!</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;

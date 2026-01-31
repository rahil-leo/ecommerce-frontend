import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Loader, Alert } from '@components/common';
import { categoryService } from '@services';
import { ROUTES } from '@constants';
import styles from './CategoryDetail.module.css';

const CategoryDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const productsPerPage = 12;

  useEffect(() => {
    fetchCategoryProducts();
  }, [slug, currentPage, sortBy]);

  useEffect(() => {
    applySearch();
  }, [searchTerm, products]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getProductsByCategory(
        slug,
        currentPage,
        productsPerPage,
        sortBy,
        searchTerm
      );

      if (response.success) {
        setCategory(response.category);
        setProducts(response.data);
        setFilteredProducts(response.data);
        setTotalPages(response.pages);
        setError(null);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching category products:', err);
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const applySearch = () => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredProducts(filtered);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading && products.length === 0) {
    return <Loader fullScreen message="Loading products..." />;
  }

  if (!category && !loading) {
    return (
      <div className="container">
        <Alert type="error" message="Category not found" />
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.categoryDetail}>
        {/* Category Header */}
        {category && (
          <div 
            className={styles.header}
            style={{ borderColor: category.color }}
          >
            <div className={styles.headerContent}>
              <span className={styles.icon}>{category.icon}</span>
              <div>
                <h1 className={styles.title}>{category.name}</h1>
                {category.description && (
                  <p className={styles.description}>{category.description}</p>
                )}
              </div>
            </div>
            <button 
              className={styles.backBtn}
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </button>
          </div>
        )}

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {/* Filters and Sort */}
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search in this category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.sortSelect}
          >
            <option value="-createdAt">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-rating">Highest Rated</option>
            <option value="name">Name: A to Z</option>
          </select>

          <span className={styles.resultCount}>
            {filteredProducts.length} products
          </span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className={styles.noProducts}>
            <p>No products found in this category</p>
          </div>
        ) : (
          <>
            <div className={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <Card 
                  key={product._id} 
                  padding="none" 
                  hover 
                  className={`${styles.productCard} ${product.stock === 0 ? styles.outOfStock : ''}`}
                  onClick={() => navigate(`${ROUTES.PRODUCTS}/${product._id}`)}
                >
                  {product.stock === 0 && (
                    <div className={styles.outOfStockBadge}>Out of Stock</div>
                  )}
                  <div className={styles.imageWrapper}>
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className={styles.productImage}
                      style={{ opacity: product.stock === 0 ? 0.5 : 1 }}
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                    {product.stock > 0 && product.stock < 5 && (
                      <p className={styles.lowStockWarning}>
                        Only {product.stock} left!
                      </p>
                    )}
                    <div className={styles.productFooter}>
                      <span className={styles.productPrice}>${product.price}</span>
                      <div className={styles.productRating}>
                        ⭐ {product.rating ? product.rating.toFixed(1) : '0'} 
                        ({product.numReviews || 0})
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.paginationBtn}
                >
                  ← Previous
                </button>

                <div className={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.paginationBtn}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, ProductCarousel } from '@components/common';
import { ROUTES } from '@constants';
import { productService, categoryService } from '@services';
import styles from './Home.module.css';

const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch new products
        const newProdsResponse = await productService.getNewProducts();
        const newProdsData = newProdsResponse.data || newProdsResponse || [];
        setNewProducts(newProdsData);

        // Fetch featured categories
        const categoriesResponse = await categoryService.getFeaturedCategories();
        const categoriesData = categoriesResponse.data || categoriesResponse || [];
        setFeaturedCategories(categoriesData);

        // Fetch products for each featured category
        const productsMap = {};
        for (const category of categoriesData) {
          try {
            const productsResponse = await productService.getProductsByCategory(category._id);
            const productsData = productsResponse.data || productsResponse || [];
            productsMap[category._id] = productsData;
          } catch (err) {
            console.error(`Error fetching products for category ${category.name}:`, err);
            productsMap[category._id] = [];
          }
        }
        setCategoryProducts(productsMap);
      } catch (err) {
        console.error('Error fetching home page data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Welcome to EcomStore</h1>
            <p className={styles.heroSubtitle}>
              Discover amazing products at unbeatable prices
            </p>
            <Link to={ROUTES.PRODUCTS}>
              <Button size="large">Shop Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Products Carousel */}
      {!loading && newProducts.length > 0 && (
        <section className={`${styles.productsSection} container`}>
          <ProductCarousel
            products={newProducts}
            title="New Arrivals"
            description="Check out our latest products added in the last 48 hours"
          />
        </section>
      )}

      {/* Featured Categories Carousels */}
      {!loading && featuredCategories.length > 0 && (
        <div className={styles.categoriesContainer}>
          {featuredCategories.map((category) => (
            <section key={category._id} className={`${styles.productsSection} container`}>
              <ProductCarousel
                products={categoryProducts[category._id] || []}
                title={`Shop ${category.name}`}
                description={category.description}
              />
            </section>
          ))}
        </div>
      )}

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Start Shopping?</h2>
            <p className={styles.ctaText}>
              Browse our collection of quality products
            </p>
            <Link to={ROUTES.PRODUCTS}>
              <Button size="large" variant="secondary">Explore Products</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


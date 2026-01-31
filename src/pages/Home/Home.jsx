import { Link } from 'react-router-dom';
import { Button, Card } from '@components/common';
import { ROUTES } from '@constants';
import styles from './Home.module.css';

const Home = () => {
  const features = [
    { icon: '🚚', title: 'Free Shipping', description: 'On orders over $50' },
    { icon: '🔒', title: 'Secure Payment', description: '100% secure transactions' },
    { icon: '↩️', title: 'Easy Returns', description: '30-day return policy' },
    { icon: '⭐', title: 'Best Quality', description: 'Top-rated products' },
  ];

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

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <Card key={index} padding="medium" className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

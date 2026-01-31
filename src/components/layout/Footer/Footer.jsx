import { Link } from 'react-router-dom';
import { ROUTES } from '@constants';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContent}`}>
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>EcomStore</h3>
          <p className={styles.sectionText}>
            Your one-stop shop for quality products at great prices.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Quick Links</h4>
          <ul className={styles.linkList}>
            <li><Link to={ROUTES.HOME} className={styles.link}>Home</Link></li>
            <li><Link to={ROUTES.PRODUCTS} className={styles.link}>Products</Link></li>
            <li><Link to={ROUTES.ABOUT} className={styles.link}>About Us</Link></li>
            <li><Link to={ROUTES.CONTACT} className={styles.link}>Contact</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Customer Service</h4>
          <ul className={styles.linkList}>
            <li><Link to="#" className={styles.link}>Help Center</Link></li>
            <li><Link to="#" className={styles.link}>Shipping Info</Link></li>
            <li><Link to="#" className={styles.link}>Returns</Link></li>
            <li><Link to="#" className={styles.link}>Privacy Policy</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Follow Us</h4>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>Facebook</a>
            <a href="#" className={styles.socialLink}>Twitter</a>
            <a href="#" className={styles.socialLink}>Instagram</a>
            <a href="#" className={styles.socialLink}>LinkedIn</a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className="container">
          <p className={styles.copyright}>
            © {currentYear} EcomStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

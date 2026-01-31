import { Link } from 'react-router-dom';
import { useCart } from '@context/CartContext';
import { useAuth } from '@context/AuthContext';
import { ROUTES } from '@constants';
import styles from './Header.module.css';

const Header = () => {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContent}`}>
        <Link to={ROUTES.HOME} className={styles.logo}>
          <span className={styles.logoIcon}>🛒</span>
          <span className={styles.logoText}>EcomStore</span>
        </Link>

        <nav className={styles.nav}>
          <Link to={ROUTES.HOME} className={styles.navLink}>Home</Link>
          <Link to={ROUTES.PRODUCTS} className={styles.navLink}>Products</Link>
          <Link to={ROUTES.ABOUT} className={styles.navLink}>About</Link>
          <Link to={ROUTES.CONTACT} className={styles.navLink}>Contact</Link>
        </nav>

        <div className={styles.actions}>
          <Link to={ROUTES.CART} className={styles.cartButton}>
            <span className={styles.cartIcon}>🛒</span>
            {cartItemsCount > 0 && (
              <span className={styles.cartBadge}>{cartItemsCount}</span>
            )}
          </Link>

          {user ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>
                {user.role === 'admin' ? 'Admin User' : user.name || 'User'}
              </span>
              <button onClick={logout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          ) : (
            <Link to={ROUTES.LOGIN} className={styles.loginButton}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

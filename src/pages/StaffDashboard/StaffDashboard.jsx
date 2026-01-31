import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { DashboardTile } from '@components/common';
import { ROUTES } from '@constants';
import styles from './StaffDashboard.module.css';

const StaffDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only allow staff to access this page
    if (!loading && (!user || user.role !== 'staff')) {
      navigate('/login/staff');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className="container">
          <div className={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  const tiles = [
    {
      title: 'Add Product',
      icon: '📦',
      description: 'Add new products to your store',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      onClick: () => navigate(ROUTES.ADMIN_ADD_PRODUCT)
    }
  ];

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <h1 className={styles.title}>Staff Dashboard</h1>
        <p className={styles.subtitle}>Welcome, {user?.name}!</p>

        <div className={styles.tilesGrid}>
          {tiles.map((tile, index) => (
            <DashboardTile key={index} {...tile} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { DashboardTile } from '@components/common';
import { ROUTES } from '@constants';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth
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
    },
    {
      title: 'Add Staff',
      icon: '👥',
      description: 'Add new staff members',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      onClick: () => navigate(ROUTES.ADMIN_ADD_STAFF)
    },
    {
      title: 'Staff Details',
      icon: '👤',
      description: 'View all staff members',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      onClick: () => navigate(ROUTES.ADMIN_STAFF_DETAILS)
    }
  ];

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <h1 className={styles.title}>Admin Dashboard</h1>
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

export default AdminDashboard;

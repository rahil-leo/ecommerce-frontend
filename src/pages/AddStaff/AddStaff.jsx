import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Button } from '@components/common';
import { AddStaffForm } from '@components/admin';
import styles from './AddStaff.module.css';

const AddStaff = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.addStaff}>
      <div className="container">
        <div className={styles.header}>
          <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
            ← Back to Dashboard
          </Button>
          <h1 className={styles.title}>Add Staff Member</h1>
        </div>

        <div className={styles.content}>
          <AddStaffForm />
        </div>
      </div>
    </div>
  );
};

export default AddStaff;

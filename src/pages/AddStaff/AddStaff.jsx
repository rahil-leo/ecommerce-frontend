import { useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { BackButton } from '@components/common';
import { AddStaffForm } from '@components/admin';
import styles from './AddStaff.module.css';

const AddStaff = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      window.location.href = '/login';
    }
  }, [user, loading]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.addStaff}>
      <div className="container">
        <div className={styles.header}>
          <BackButton to="/admin/dashboard" text="← Back to Dashboard" />
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

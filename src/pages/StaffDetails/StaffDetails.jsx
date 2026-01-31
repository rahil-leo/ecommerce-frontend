import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { staffService } from '@services';
import { Loader, Alert } from '@components/common';
import styles from './StaffDetails.module.css';

const StaffDetails = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Check if user is admin
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await staffService.getAllStaff();
      if (response.success) {
        setStaff(response.data);
      } else {
        setError('Failed to fetch staff details');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching staff details');
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const response = await staffService.deleteStaff(staffId);
        if (response.success) {
          setSuccess('Staff member deleted successfully');
          fetchStaff();
          setTimeout(() => setSuccess(null), 3000);
        } else {
          setError(response.message || 'Error deleting staff member');
        }
      } catch (err) {
        console.error('Delete error:', err);
        setError(err.message || 'Error deleting staff member');
      }
    }
  };

  const handleToggleStatus = async (staffId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
      const response = await staffService.updateStaff(staffId, { isActive: newStatus });
      if (response.success) {
        setSuccess(
          newStatus === 'active' 
            ? 'Staff member enabled successfully' 
            : 'Staff member disabled successfully'
        );
        fetchStaff();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Error updating staff member');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Error updating staff member');
    }
  };

  if (authLoading || loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Staff Details</h1>
          <button 
            className={styles.backBtn}
            onClick={() => navigate('/admin/dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <div className={styles.staffListContainer}>
          {staff.length === 0 ? (
            <div className={styles.noData}>
              <p>No staff members found</p>
            </div>
          ) : (
            <div className={styles.staffGrid}>
              {staff.map((staffMember) => (
                <div key={staffMember._id} className={styles.staffCard}>
                  <div className={styles.cardContent}>
                    <div className={styles.staffInfo}>
                      <h3 className={styles.name}>{staffMember.name}</h3>
                      <p className={styles.role}>
                        <span className={styles.roleLabel}>Role:</span>
                        <span className={styles.roleValue}>{staffMember.role}</span>
                      </p>
                      <p className={styles.email}>
                        <span className={styles.label}>Email:</span>
                        {staffMember.email}
                      </p>
                      <p className={styles.phone}>
                        <span className={styles.label}>Phone:</span>
                        {staffMember.phone || 'N/A'}
                      </p>
                      <p className={styles.status}>
                        <span className={styles.label}>Status:</span>
                        <span className={staffMember.isActive === 'active' ? styles.active : styles.inactive}>
                          {staffMember.isActive === 'active' ? 'Active' : 'Disabled'}
                        </span>
                      </p>
                      <p className={styles.date}>
                        <span className={styles.label}>Created:</span>
                        {new Date(staffMember.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <button 
                      className={staffMember.isActive === 'active' ? styles.disableBtn : styles.enableBtn}
                      onClick={() => handleToggleStatus(staffMember._id, staffMember.isActive)}
                    >
                      {staffMember.isActive === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(staffMember._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDetails;

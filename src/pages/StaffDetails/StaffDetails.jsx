import { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { staffService } from '@services';
import { Loader, Toast, ConfirmDialog, BackButton } from '@components/common';
import styles from './StaffDetails.module.css';

const StaffDetails = () => {
  const { user, loading: authLoading } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: null, // 'delete', 'disable', 'enable'
    staffId: null,
    staffName: null
  });

  useEffect(() => {
    // Check if user is admin
    if (!authLoading && (!user || user.role !== 'admin')) {
      window.location.href = '/login';
    }
  }, [user, authLoading]);

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

  const handleDelete = (staffId, staffName) => {
    setDialog({
      isOpen: true,
      type: 'delete',
      staffId,
      staffName
    });
  };

  const handleToggleStatus = (staffId, staffName, currentStatus) => {
    const type = currentStatus === 'active' ? 'disable' : 'enable';
    setDialog({
      isOpen: true,
      type,
      staffId,
      staffName
    });
  };

  const handleConfirmDialog = async () => {
    const { type, staffId } = dialog;
    setIsProcessing(true);

    try {
      if (type === 'delete') {
        const response = await staffService.deleteStaff(staffId);
        if (response.success) {
          setLastAction({ type: 'delete', staffId });
          setSuccess('Staff member deleted successfully');
          // Log admin action
          console.log(`[AUDIT] Admin ${user.name} deleted staff member with ID: ${staffId}`);
          fetchStaff();
          setTimeout(() => setSuccess(null), 5000);
        } else {
          setError(response.message || 'Error deleting staff member');
        }
      } else if (type === 'disable' || type === 'enable') {
        const newStatus = type === 'enable' ? 'active' : 'disabled';
        const response = await staffService.updateStaff(staffId, { isActive: newStatus });
        if (response.success) {
          setLastAction({ type, staffId, previousStatus: type === 'enable' ? 'disabled' : 'active', newStatus });
          setSuccess(
            type === 'enable'
              ? 'Staff member enabled successfully'
              : 'Staff member disabled successfully'
          );
          // Log admin action
          console.log(`[AUDIT] Admin ${user.name} ${type === 'enable' ? 'enabled' : 'disabled'} staff member with ID: ${staffId}`);
          fetchStaff();
          setTimeout(() => setSuccess(null), 5000);
        } else {
          setError(response.message || 'Error updating staff member');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error performing action');
    } finally {
      setIsProcessing(false);
    }

    setDialog({ isOpen: false, type: null, staffId: null, staffName: null });
  };

  const handleCancelDialog = () => {
    setDialog({ isOpen: false, type: null, staffId: null, staffName: null });
  };

  const handleUndo = async () => {
    if (!lastAction) return;

    setIsProcessing(true);
    try {
      if (lastAction.type === 'disable' || lastAction.type === 'enable') {
        // Reverse the action
        const reverseStatus = lastAction.type === 'enable' ? 'disabled' : 'active';
        await staffService.updateStaff(lastAction.staffId, { isActive: reverseStatus });
        console.log(`[AUDIT] Admin ${user.name} undid ${lastAction.type} action for staff ID: ${lastAction.staffId}`);
        fetchStaff();
        setSuccess('Action undone successfully');
        setLastAction(null);
        setTimeout(() => setSuccess(null), 3000);
      }
      // Note: Delete cannot be undone (would require restore from backup)
    } catch (err) {
      setError('Failed to undo action');
      console.error('Undo error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const getDialogConfig = () => {
    const { type, staffName } = dialog;

    switch (type) {
      case 'delete':
        return {
          title: 'Delete Staff Member',
          message: `Are you sure you want to delete ${staffName}? This action cannot be undone.`,
          confirmText: 'Delete',
          isDanger: true
        };
      case 'disable':
        return {
          title: 'Disable Staff Member',
          message: `Are you sure you want to disable ${staffName}? They will not be able to login.`,
          confirmText: 'Disable',
          isDanger: true
        };
      case 'enable':
        return {
          title: 'Enable Staff Member',
          message: `Are you sure you want to enable ${staffName}? They will be able to login again.`,
          confirmText: 'Enable',
          isDanger: false
        };
      default:
        return {
          title: 'Confirm',
          message: 'Are you sure?',
          confirmText: 'Confirm',
          isDanger: false
        };
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
          <BackButton to="/admin/dashboard" text="← Back to Dashboard" />
        </div>

        {error && <Toast type="error" message={error} onDismiss={() => setError(null)} />}
        {success && (
          <Toast 
            type="success" 
            message={success} 
            onDismiss={() => setSuccess(null)}
            onUndo={lastAction && (lastAction.type === 'disable' || lastAction.type === 'enable') ? handleUndo : null}
            undoText="↺ Undo"
          />
        )}

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
                      onClick={() => handleToggleStatus(staffMember._id, staffMember.name, staffMember.isActive)}
                      disabled={isProcessing}
                    >
                      {staffMember.isActive === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(staffMember._id, staffMember.name)}
                      disabled={isProcessing}
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

      <ConfirmDialog
        isOpen={dialog.isOpen}
        onConfirm={handleConfirmDialog}
        onCancel={handleCancelDialog}
        {...getDialogConfig()}
      />
    </div>
  );
};

export default StaffDetails;

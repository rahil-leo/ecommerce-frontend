import { useEffect } from 'react';
import Modal from '../Modal/Modal';
import styles from './ConfirmDialog.module.css';

const ConfirmDialog = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isDanger = false 
}) => {
  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen, onConfirm, onCancel]);

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="small">
      <div className={styles.dialogContent}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button 
            className={styles.cancelBtn}
            onClick={onCancel}
            title="Press Esc to cancel"
          >
            {cancelText}
          </button>
          <button 
            className={isDanger ? styles.dangerBtn : styles.confirmBtn}
            onClick={onConfirm}
            title="Press Enter to confirm"
          >
            {confirmText}
          </button>
        </div>
        <p className={styles.hint}>Press Enter to confirm or Esc to cancel</p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

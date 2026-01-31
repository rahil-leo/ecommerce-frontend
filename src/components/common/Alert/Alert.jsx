import { useEffect } from 'react';
import styles from './Alert.module.css';

const Alert = ({ 
  type = 'info', 
  message, 
  onClose, 
  autoClose = false,
  duration = 3000 
}) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
      </div>
      {onClose && (
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;

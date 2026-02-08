import { useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ 
  message, 
  type = 'success', // 'success', 'error', 'info'
  onDismiss,
  duration = 5000,
  onUndo = null,
  undoText = 'Undo'
}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
        {onUndo && (
          <button 
            className={styles.undoBtn}
            onClick={onUndo}
            title="Undo last action"
          >
            {undoText}
          </button>
        )}
      </div>
      <button 
        className={styles.closeBtn}
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;

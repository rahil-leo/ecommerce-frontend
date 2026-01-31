import { useState } from 'react';
import styles from './DashboardCard.module.css';

const DashboardCard = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.titleSection}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <h2 className={styles.title}>{title}</h2>
        </div>
        <button className={styles.toggleButton}>
          {isOpen ? '−' : '+'}
        </button>
      </div>
      
      {isOpen && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;

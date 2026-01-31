import { useNavigate } from 'react-router-dom';
import styles from './DashboardTile.module.css';

const DashboardTile = ({ title, icon, description, onClick, gradient }) => {
  return (
    <div 
      className={styles.tile} 
      onClick={onClick}
      style={{ background: gradient }}
    >
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.arrow}>→</div>
    </div>
  );
};

export default DashboardTile;

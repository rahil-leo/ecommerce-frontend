import styles from './Loader.module.css';

const Loader = ({ size = 'medium', fullScreen = false, message }) => {
  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <div className={`${styles.spinner} ${styles[size]}`}></div>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`}></div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Loader;

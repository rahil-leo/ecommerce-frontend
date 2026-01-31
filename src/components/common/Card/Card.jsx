import styles from './Card.module.css';

const Card = ({ 
  children, 
  className = '', 
  padding = 'medium',
  hover = false,
  onClick 
}) => {
  const cardClass = `
    ${styles.card} 
    ${styles[padding]} 
    ${hover ? styles.hover : ''} 
    ${onClick ? styles.clickable : ''} 
    ${className}
  `.trim();

  return (
    <div className={cardClass} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;

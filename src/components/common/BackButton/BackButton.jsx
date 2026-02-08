import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

const BackButton = ({ 
  to = -1, 
  text = '← Back',
  variant = 'outline',
  className = ''
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof to === 'number') {
      navigate(to);
    } else {
      navigate(to);
    }
  };

  return (
    <Button 
      variant={variant}
      onClick={handleClick}
      className={className}
    >
      {text}
    </Button>
  );
};

export default BackButton;

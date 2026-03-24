import { Badge, Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import styles from './FloatingCart.module.css';

const FloatingCart = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  if (cart.length === 0) return null;

  const handleClick = () => {
    if (location.pathname !== '/explore') {
      navigate('/explore?openCart=true'); 
    } else {
      window.dispatchEvent(new CustomEvent('open-borrow-modal'));
    }
  };

  return (
    <div className={styles.floatingCartContainer}>
      <Badge count={cart.length} offset={[-5, 5]}>
        <Button 
          type="primary" 
          shape="circle" 
          icon={<ShoppingOutlined style={{ fontSize: '24px' }} />} 
          className={styles.floatingCartBtn}
          onClick={handleClick}
        />
      </Badge>
    </div>
  );
};

export default FloatingCart;
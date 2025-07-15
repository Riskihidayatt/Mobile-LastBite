import { useSelector, useDispatch } from 'react-redux';
import { 
  addToCart, 
  removeItemFromCart, 
  increaseItemQuantity, 
  decreaseItemQuantity, 
  clearCart 
} from '../redux/slice/cartSlice';

const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const addItem = (menuItemId, quantity) => {
    dispatch(addToCart({ menuItemId, quantity }));
  };

  const removeItem = (menuItemId, storeName) => {
    dispatch(removeItemFromCart({ menuItemId, storeName }));
  };

  const increaseQuantity = (menuItemId, storeName) => {
    dispatch(increaseItemQuantity({ menuItemId, storeName }));
  };

  const decreaseQuantity = (menuItemId, storeName) => {
    dispatch(decreaseItemQuantity({ menuItemId, storeName }));
  };

  const emptyCart = () => {
    dispatch(clearCart());
  };

  return {
    cart,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    emptyCart,
  };
};

export default useCart;
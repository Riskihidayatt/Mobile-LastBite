import authApi from './config/authApi';
import cartApi from './config/cartApi';
import menuItemApi from './config/menuItemApi';
import menuItemReviewApi from './config/menuItemReviewApi';
import orderApi from './config/orderApi';
import paymentApi from './config/paymentApi';
import sellerApi from './config/sellerApi';
import uploadApi from './config/uploadApi';
import userApi from './config/userApi';

const APIs = {
  auth: authApi,
  carts: cartApi,
  menuItems: menuItemApi,
  menuItemReviews: menuItemReviewApi,
  orders: orderApi,
  payments: paymentApi,
  sellers: sellerApi,
  users: userApi,
  upload: uploadApi,
};

export default APIs;

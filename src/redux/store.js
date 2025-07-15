import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import authReducer from "./slice/authSlice";
import orderReducer from "./slice/orderSlice";
import cartReducer from "./slice/cartSlice";
import menuReducer from "./slice/menuSlice";
import modalReducer from "./slice/modalSlice";
import reviewReducer from "./slice/ReviewSlice";
import ConfigAPI, { applyInterceptors } from "../api/axiosConfig";

const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    orders: orderReducer,
    cart: cartReducer,
    menu: menuReducer,
    modal: modalReducer,
    reviews: reviewReducer,
  },
});

applyInterceptors(ConfigAPI, store);

export default store;

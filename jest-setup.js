// jest-setup.js

jest.mock('expo-constants', () => ({
  manifest: {},
}));

jest.mock('react-native-maps', () => 'MapView');

jest.mock('react-native-gesture-handler', () => {});

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      replace: jest.fn(),
    }),
    useFocusEffect: jest.fn(),
  };
});

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

// Mock common React Native components to prevent nativewind issues
jest.mock('react-native', () => {
  const ReactNative = jest.requireActual('react-native');
  return Object.setPrototypeOf({
    Text: ReactNative.Text,
    View: ReactNative.View,
    TouchableOpacity: ReactNative.TouchableOpacity,
    TextInput: ReactNative.TextInput,
    Image: ReactNative.Image,
    ActivityIndicator: ReactNative.ActivityIndicator,
    // Add other components as needed
  }, ReactNative);
});

// Global mock for src/api/index.js
jest.mock('./src/api/index', () => ({
  __esModule: true,
  default: {
    auth: { post: jest.fn() },
    menuItems: { get: jest.fn() },
    users: { get: jest.fn(), put: jest.fn() },
    cart: { post: jest.fn(), get: jest.fn(), delete: jest.fn(), put: jest.fn() },
    menuItemReview: { post: jest.fn(), get: jest.fn() },
    order: { post: jest.fn(), get: jest.fn() },
    payment: { post: jest.fn(), get: jest.fn() },
    seller: { post: jest.fn(), get: jest.fn() },
    upload: { post: jest.fn() },
  },
}));

// Mock individual API files to ensure their exported functions are Jest mocks
jest.mock('./src/api/config/authApi', () => ({
  __esModule: true,
  default: { defaults: { baseURL: 'http://localhost:5000/api/auth' } },
}));
jest.mock('./src/api/config/cartApi', () => ({
  __esModule: true,
  addItemToCart: jest.fn(),
  getCart: jest.fn(),
  deleteCartItem: jest.fn(),
  updateItemQuantity: jest.fn(),
  default: { defaults: { baseURL: 'http://localhost:5000/api/carts' } },
}));
jest.mock('./src/api/config/menuItemApi', () => ({
  __esModule: true,
  default: { defaults: { baseURL: 'http://10.10.102.131:8080/api' } },
}));
jest.mock('./src/api/config/menuItemReviewApi', () => ({
  __esModule: true,
  submitReview: jest.fn(),
  getReviewsByMenuItem: jest.fn(),
  default: { defaults: { baseURL: 'http://localhost:5000/api/menu-item-reviews' } },
}));
jest.mock('./src/api/config/orderApi', () => ({
  __esModule: true,
  createOrder: jest.fn(),
  getCustomerOrders: jest.fn(),
  createDirectOrder: jest.fn(),
  default: { defaults: { baseURL: 'http://localhost:5000/api/orders' } },
}));
jest.mock('./src/api/config/paymentApi', () => ({
  __esModule: true,
  default: { defaults: { baseURL: 'http://localhost:5000/api/payments' } },
}));
jest.mock('./src/api/config/sellerApi', () => ({
  __esModule: true,
  default: { defaults: { baseURL: 'http://localhost:5000/api/sellers' } },
}));
jest.mock('./src/api/config/uploadApi', () => ({
  __esModule: true,
  default: { defaults: { baseURL: 'http://localhost:5000/api/upload', headers: { 'Content-Type': 'multipart/form-data' } } },
}));
jest.mock('./src/api/config/userApi', () => ({
  __esModule: true,
  default: { defaults: { baseURL: 'http://localhost:5000/api/users' } },
}));

// Mock for src/redux/slice/authSlice.js to prevent undefined reducer issue
jest.mock('./src/redux/slice/authSlice', () => {
  const originalModule = jest.requireActual('./src/redux/slice/authSlice');
  return {
    __esModule: true,
    ...originalModule,
    setAuthState: jest.fn(originalModule.setAuthState),
    logoutUser: jest.fn(originalModule.logoutUser),
    loginUser: jest.fn(originalModule.loginUser),
    registerUser: jest.fn(originalModule.registerUser),
    default: originalModule.default, // Use the actual reducer
  };
});

// Mock for src/screen/Screen.jsx
jest.mock('./src/screen/Screen', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({
    __esModule: true,
    default: ({ children }) => React.createElement(View, null, children),
  });
});

// Mock for src/utils/getCurrentLocation.js
jest.mock('./src/utils/getCurrentLocation', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({ coords: { latitude: 0, longitude: 0 } })),
}));

jest.mock('react-native-css-interop', () => ({}));
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import APIs from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loginUser,
  registerUser,
  logoutUser,
  setAuthState,
} from '../redux/slice/authSlice';
import { fetchUserMe } from '../redux/slice/userSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, status: userStatus, error: userError } = useSelector((state) => state.user);
  const { token, refreshToken, isAuthenticated, status: authStatus, error: authError } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

        if (storedToken && storedRefreshToken) {
          APIs.auth.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          APIs.users.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          dispatch(setAuthState({ isAuthenticated: true, token: storedToken, refreshToken: storedRefreshToken }));
          dispatch(fetchUserMe());
        } else {
          delete APIs.auth.defaults.headers.common['Authorization'];
          delete APIs.users.defaults.headers.common['Authorization'];
          dispatch(setAuthState({ isAuthenticated: false, token: null, refreshToken: null }));
        }
      } catch (err) {
        console.error('Failed to load auth data from storage', err);
        dispatch(setAuthState({ isAuthenticated: false, token: null, refreshToken: null }));
      }
    };
    loadAuthData();
  }, [dispatch]);

  

  const login = useCallback(async (credentials) => {
    const resultAction = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(resultAction)) {
      const { token: receivedToken, refreshToken: receivedRefreshToken } = resultAction.payload;
      await AsyncStorage.setItem('userToken', receivedToken);
      await AsyncStorage.setItem('refreshToken', receivedRefreshToken);
      APIs.auth.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      APIs.users.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      dispatch(fetchUserMe());
      return { success: true };
    } else {
      return { success: false, error: resultAction.payload || 'Login failed' };
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('refreshToken');
      delete APIs.auth.defaults.headers.common['Authorization'];
      delete APIs.users.defaults.headers.common['Authorization'];
      dispatch(logoutUser()); // Dispatch only once after storage is cleared
      return { success: true };
    } catch (err) {
      console.error('Failed to clear AsyncStorage on logout:', err);
      // Even if AsyncStorage fails, we should still clear Redux state
      dispatch(logoutUser());
      return { success: false, error: 'Logout failed: Could not clear local storage.' };
    }
  }, [dispatch]);

  const register = useCallback(async (userData) => {
    const resultAction = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(resultAction)) {
      return { success: true };
    } else {
      return { success: false, error: resultAction.payload || 'Registration failed' };
    }
  }, [dispatch]);

  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    loading: authStatus === 'loading' || userStatus === 'loading',
    error: authError || userError,
    login,
    logout,
    register,
  };
};

export default useAuth;

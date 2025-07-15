import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser } from '../redux/slice/authSlice';

const API_BASE_URL = `${Constants.expoConfig?.extra?.API_BASE_URL}/api`;

const ConfigAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const applyInterceptors = (instance, store) => {
  // Request Interceptor
  instance.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Jika error 401 dan bukan permintaan refresh token itu sendiri
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (!refreshToken) {
              store.dispatch(logoutUser());
              processQueue('No refresh token available');
              return reject(error);
            }

            const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
              refreshToken: refreshToken,
            });

            const { token: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

            await AsyncStorage.setItem('userToken', newAccessToken);
            if (newRefreshToken) {
              await AsyncStorage.setItem('refreshToken', newRefreshToken);
            }

            instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            resolve(instance(originalRequest));
          } catch (refreshError) {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('refreshToken');
            store.dispatch(logoutUser()); 
            processQueue(refreshError);
            reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        });
      }

      return Promise.reject(error);
    }
  );
};

export default ConfigAPI;
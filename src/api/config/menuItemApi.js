import axios from 'axios';
import Constants from 'expo-constants';

const menuItemApi = axios.create({
  baseURL: `${Constants.expoConfig?.extra?.API_BASE_URL}/api`,
});

export default menuItemApi;
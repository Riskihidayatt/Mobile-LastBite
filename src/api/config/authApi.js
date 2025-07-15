import ConfigAPI from '../axiosConfig';

const authApi = ConfigAPI.create({
  baseURL: `${ConfigAPI.defaults.baseURL}/auth`,
});

export default authApi;
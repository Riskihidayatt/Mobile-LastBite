import ConfigAPI from '../axiosConfig';

const userApi = ConfigAPI.create({
  baseURL: `${ConfigAPI.defaults.baseURL}/users`,
});

export default userApi;
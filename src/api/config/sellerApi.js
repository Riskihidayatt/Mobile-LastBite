import ConfigAPI from '../axiosConfig';

const sellerApi = ConfigAPI.create({
  baseURL: `${ConfigAPI.defaults.baseURL}/sellers`,
});

export default sellerApi;
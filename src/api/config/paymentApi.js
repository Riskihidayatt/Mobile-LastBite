import ConfigAPI from '../axiosConfig';

const paymentApi = ConfigAPI.create({
  baseURL: `${ConfigAPI.defaults.baseURL}/payments`,
});

export default paymentApi;
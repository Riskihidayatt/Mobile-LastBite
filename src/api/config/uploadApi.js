import ConfigAPI from '../axiosConfig';

const uploadApi = ConfigAPI.create({
  baseURL: `${ConfigAPI.defaults.baseURL}/upload`,
  headers: {
    ...ConfigAPI.defaults.headers,
    'Content-Type': 'multipart/form-data',
  },
});

export default uploadApi;
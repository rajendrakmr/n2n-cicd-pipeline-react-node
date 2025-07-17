import axios from 'axios';

const BaseUrl = process.env.REACT_APP_API_DPL_URL;

const instance = axios.create({
  baseURL: BaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    // If needed later, you can inject authorization headers here
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`Error ${error.response.status}:`, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default instance;

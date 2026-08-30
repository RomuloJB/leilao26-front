import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8080';
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    console.log(JSON.stringify(error), status)
    // if (status === 401 || status === 403) {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('usuario');
    //   if (window.location.pathname !== '/login') {
    //     window.location.href = '/login';
    //   }
    // }
    return Promise.reject(error);
  }
);

const Api = {
    get: async (route) => {
        return api.get(route);
    },
    post: async (route, data, config) => {
        return api.post(route, data, config);
    },
    put: async (route, data, config) => {
        return api.put(route, data, config);
    },
    delete: async (route) => {
        return api.delete(route);
    },
};

export default Api;

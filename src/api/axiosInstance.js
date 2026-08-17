import axios from 'axios';

// Ajuste para a URL real do seu back-end
const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Anexa o token em toda requisição autenticada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se o token expirou ou é inválido, o back devolve 401/403:
// limpa a sessão local e manda o usuário de volta pro login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

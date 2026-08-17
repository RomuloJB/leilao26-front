import api from '../api/axiosInstance';

export async function login(username, senha) {
  const response = await api.post('/auth/login', { username, senha });
  return response.data; // { token, id, username }
}

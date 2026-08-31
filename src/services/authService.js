import api from '../api/axiosInstance';

export async function login(username, senha) {
  const response = await api.post('/auth/login', { username, senha });
  return response.data; // { token, id, username }
}

export async function cadastrar({ username, email, senha, tipoPerfil }) {
  const response = await api.post('/auth/registrar', {
    username,
    email,
    senha,
    tipoPerfil, // 'COMPRADOR' | 'VENDEDOR'
  });
  return response.data; // { token, id, username }
}

export async function recuperarSenha(email) {
  const response = await api.post('/auth/recuperar-senha', { email });
  return response.data;
}

export async function alterarSenha({ email, codigo, novaSenha }) {
  const response = await api.post('/auth/alterar-senha', { email, codigo, novaSenha });
  return response.data;
}
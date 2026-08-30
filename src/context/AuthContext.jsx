import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginService, cadastrar as cadastrarService } from '../services/authService';

const AuthContext = createContext(null);

function tokenExpirado(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  // enquanto "carregando" é true, ainda não sabemos se existe uma sessão salva no localStorage. Usado pra não "piscar" a tela de login em reloads.
  const [carregando, setCarregando] = useState(true);

    useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');

    if (token && usuarioSalvo) {
      if (tokenExpirado(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      } else {
        setUsuario(JSON.parse(usuarioSalvo));
      }
    }

    setCarregando(false);
  }, []);

  // verifica a cada 1min se o token venceu enquanto a aba está aberta
    useEffect(() => {
    const intervalo = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token && tokenExpirado(token)) {
        logout();
      }
    }, 60 * 1000);

    return () => clearInterval(intervalo);
  }, []);

  function salvarSessao(dados) {
    const usuarioLogado = { id: dados.id, username: dados.username, roles: dados.roles || [] };
    localStorage.setItem('token', dados.token);
    localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
    setUsuario(usuarioLogado);
  }

  async function login(username, senha) {
    const dados = await loginService(username, senha);
    salvarSessao(dados);
  }

  // o back-end já devolve um token no cadastro (igual ao login), então o usuário fica autenticado automaticamente assim que se cadastra.
  async function cadastrar(dadosCadastro) {
    const dados = await cadastrarService(dadosCadastro);
    salvarSessao(dados);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  const value = {
    usuario,
    autenticado: !!usuario,
    carregando,
    login,
    cadastrar,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um <AuthProvider>');
  }
  return context;
}
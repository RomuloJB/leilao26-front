import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginService, cadastrar as cadastrarService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  // Enquanto "carregando" é true, ainda não sabemos se existe uma sessão
  // salva no localStorage. Usado pra não "piscar" a tela de login em reloads.
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');

    if (token && usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }

    setCarregando(false);
  }, []);

  function salvarSessao(dados) {
    const usuarioLogado = { id: dados.id, username: dados.username };
    localStorage.setItem('token', dados.token);
    localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
    setUsuario(usuarioLogado);
  }

  async function login(username, senha) {
    const dados = await loginService(username, senha);
    salvarSessao(dados);
  }

  // O back-end já devolve um token no cadastro (igual ao login), então o
  // usuário fica autenticado automaticamente assim que se cadastra.
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
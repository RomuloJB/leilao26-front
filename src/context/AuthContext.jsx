import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginService } from '../services/authService';

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

  async function login(username, senha) {
    const dados = await loginService(username, senha);
    const usuarioLogado = { id: dados.id, username: dados.username };

    localStorage.setItem('token', dados.token);
    localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
    setUsuario(usuarioLogado);
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

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await login(username, senha);
      navigate('/');
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        setErro('Usuário ou senha inválidos.');
      } else {
        setErro('Não foi possível conectar ao servidor. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1 className="login-title">Entrar</h1>
        <p className="login-subtitle">Acesse sua conta para continuar dando lances</p>

        <label className="login-label" htmlFor="username">
          Usuário ou e-mail
        </label>
        <input
          id="username"
          className="login-input"
          type="text"
          value={username}
          onChange={(evento) => setUsername(evento.target.value)}
          autoComplete="username"
          disabled={carregando}
          required
        />

        <label className="login-label" htmlFor="senha">
          Senha
        </label>
        <input
          id="senha"
          className="login-input"
          type="password"
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
          autoComplete="current-password"
          disabled={carregando}
          required
        />

        {erro && (
          <div className="login-erro" role="alert">
            {erro}
          </div>
        )}

        <button className="login-botao" type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="login-cadastro">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}
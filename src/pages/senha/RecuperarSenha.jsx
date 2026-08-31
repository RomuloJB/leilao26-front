import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recuperarSenha } from '../../services/authService';
import '../login/Login.css';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await recuperarSenha(email);
      setEnviado(true);
    } catch (err) {
      const status = err.response?.status;
      const mensagem = err.response?.data?.message;
      if (status === 400) {
        setErro(mensagem || 'Verifique os dados informados e tente novamente.');
      } else {
        setErro('Não foi possível alterar a senha. Verifique os dados e tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  }

  if (enviado) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1 className="login-title">Verifique seu e-mail</h1>
          <p className="login-subtitle">
            Se <strong>{email}</strong> estiver cadastrado, você vai receber um código para redefinir a senha.
          </p>
          <Link to={`/alterar-senha?email=${encodeURIComponent(email)}`} className="login-botao login-botao-link">
            Já tenho o código
          </Link>
          <p className="login-cadastro">
            <Link to="/login">Voltar para o login</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1 className="login-title">Recuperar senha</h1>
        <p className="login-subtitle">Informe seu e-mail para receber um código de recuperação</p>

        <label className="login-label" htmlFor="email">E-mail</label>
        <input
          id="email"
          className="login-input"
          type="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          autoComplete="email"
          disabled={carregando}
          required
        />

        {erro && <div className="login-erro" role="alert">{erro}</div>}

        <div className="login-acoes">
          <button type="button" className="login-botao-secundario" onClick={() => navigate('/login')} disabled={carregando}>
            Cancelar
          </button>
          <button className="login-botao" type="submit" disabled={carregando}>
            {carregando ? 'Enviando...' : 'Recuperar senha'}
          </button>
        </div>
      </form>
    </div>
  );
}
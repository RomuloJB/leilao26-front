import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { alterarSenha } from '../../services/authService';
import '../login/Login.css';

export default function AlterarSenha() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro('');

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setCarregando(true);

    try {
      await alterarSenha({ email, codigo, novaSenha });
      alert('Senha alterada com sucesso! Faça login com a nova senha.');
      navigate('/login');
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

    return (
      <div className="login-page">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <h1 className="login-title">Alterar senha</h1>
          <p className="login-subtitle">Informe o código recebido e defina uma nova senha</p>

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

          <label className="login-label" htmlFor="codigo">Código</label>
          <input
            id="codigo"
            className="login-input"
            type="text"
            value={codigo}
            onChange={(evento) => setCodigo(evento.target.value)}
            disabled={carregando}
            required
          />

          <label className="login-label" htmlFor="novaSenha">Nova senha</label>
          <input
            id="novaSenha"
            className="login-input"
            type="password"
            value={novaSenha}
            onChange={(evento) => setNovaSenha(evento.target.value)}
            autoComplete="new-password"
            disabled={carregando}
            required
          />

          <label className="login-label" htmlFor="confirmarSenha">Confirmar senha</label>
          <input
            id="confirmarSenha"
            className="login-input"
            type="password"
            value={confirmarSenha}
            onChange={(evento) => setConfirmarSenha(evento.target.value)}
            autoComplete="new-password"
            disabled={carregando}
            required
          />

          {erro && <div className="login-erro" role="alert">{erro}</div>}

          <div className="login-acoes">
            <button type="button" className="login-botao-secundario" onClick={() => navigate('/login')} disabled={carregando}>
              Cancelar
            </button>
            <button className="login-botao" type="submit" disabled={carregando}>
              {carregando ? 'Alterando...' : 'Alterar senha'}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
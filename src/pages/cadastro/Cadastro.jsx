import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Cadastro.css';

const PERFIS = [
  {
    valor: 'COMPRADOR',
    titulo: 'Comprador',
    descricao: 'Quero dar lances e arrematar animais.',
  },
  {
    valor: 'VENDEDOR',
    titulo: 'Vendedor',
    descricao: 'Quero anunciar animais para leilão.',
  },
];

export default function Cadastro() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoPerfil, setTipoPerfil] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { cadastrar } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro('');

    if (!tipoPerfil) {
      setErro('Selecione se você é comprador ou vendedor.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setCarregando(true);

    try {
      await cadastrar({ username, email, senha, tipoPerfil });
      navigate('/');
    } catch (err) {
      const status = err.response?.status;
      const mensagem = err.response?.data?.message;
      if (status === 409) {
        setErro(mensagem || 'Já existe uma conta com esse usuário ou e-mail.');
      } else if (status === 400) {
        setErro(mensagem || 'Verifique os dados informados e tente novamente.');
      } else {
        setErro('Não foi possível concluir o cadastro. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-page">
      <form className="cadastro-card" onSubmit={handleSubmit} noValidate>
        <h1 className="cadastro-title">Criar conta</h1>
        <p className="cadastro-subtitle">
          Cadastre-se para participar dos leilões
        </p>

        <label className="cadastro-label" htmlFor="username">
          Usuário
        </label>
        <input
          id="username"
          className="cadastro-input"
          type="text"
          value={username}
          onChange={(evento) => setUsername(evento.target.value)}
          autoComplete="username"
          disabled={carregando}
          required
        />

        <label className="cadastro-label" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          className="cadastro-input"
          type="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          autoComplete="email"
          disabled={carregando}
          required
        />

        <label className="cadastro-label" htmlFor="senha">
          Senha
        </label>
        <input
          id="senha"
          className="cadastro-input"
          type="password"
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
          autoComplete="new-password"
          disabled={carregando}
          required
        />

        <label className="cadastro-label" htmlFor="confirmarSenha">
          Confirmar senha
        </label>
        <input
          id="confirmarSenha"
          className="cadastro-input"
          type="password"
          value={confirmarSenha}
          onChange={(evento) => setConfirmarSenha(evento.target.value)}
          autoComplete="new-password"
          disabled={carregando}
          required
        />

        <span className="cadastro-label">Quero me cadastrar como</span>
        <div className="cadastro-perfil-grupo" role="radiogroup" aria-label="Tipo de perfil">
          {PERFIS.map((perfil) => (
            <button
              key={perfil.valor}
              type="button"
              role="radio"
              aria-checked={tipoPerfil === perfil.valor}
              className={
                'cadastro-perfil-opcao' +
                (tipoPerfil === perfil.valor ? ' cadastro-perfil-opcao-ativa' : '')
              }
              onClick={() => setTipoPerfil(perfil.valor)}
              disabled={carregando}
            >
              <span className="cadastro-perfil-titulo">{perfil.titulo}</span>
              <span className="cadastro-perfil-descricao">{perfil.descricao}</span>
            </button>
          ))}
        </div>

        {erro && (
          <div className="cadastro-erro" role="alert">
            {erro}
          </div>
        )}

        <button className="cadastro-botao" type="submit" disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <p className="cadastro-login">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
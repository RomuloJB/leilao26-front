import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Api from '../../api/axiosInstance';
import './Home.css';

export default function Home() {
  const { autenticado, usuario, logout } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);

  useEffect(() => {
    Api.get('/categoria/buscar')
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error('Erro ao buscar categorias:', err))
      .finally(() => setCarregandoCategorias(false));
  }, []);

  const atual = new Date();
  const dataAtual = atual.toLocaleDateString("pt-BR");
  const horaAtual = atual.toLocaleTimeString("pt-BR");
  const isAdmin = usuario?.roles?.includes('ADMIN');

  return (
    <div className="home-page">
      <header className="home-header">
        <span className="home-logo">FarmAuction</span>
        <nav className="home-nav">
          {autenticado ? (
            <div className="home-usuario">
              <span className="home-usuario-nome">Olá, {usuario?.username}</span>
              {isAdmin && (
                <Link className="home-botao-entrar" to="/admin/categorias">
                  Gerenciar categorias
                </Link>
              )}
              <button className="home-botao-sair" onClick={logout} type="button">Sair</button>
            </div>
          ) : (
            <Link className="home-botao-entrar" to="/login">Entrar</Link>
          )}
        </nav>
      </header>

      <main className="home-conteudo">
        <section className="bem-vindo">
          <h3>Bem vindo a FarmAuction, você acessou nossa página em {dataAtual} as {horaAtual}</h3>
        </section>

        <section className="home-hero">
          <h1 className="home-hero-titulo">Leilões de animais de fazenda</h1>
          <p className="home-hero-subtitulo">
            Encontre e dê lances nos melhores leilões de animais direto da fazenda.
          </p>
        </section>

        <section className="home-categorias">
          <h2 className="home-categorias-titulo">Categorias de leilões</h2>
          {carregandoCategorias && <p>Carregando categorias...</p>}
          <div className="home-categorias-grid">
            {categorias.map((categoria) => (
              <Link key={categoria.id} to={`/leiloes/categoria/${categoria.id}`} className="categoria-card">
                <span className="categoria-card-icone" aria-hidden="true">{categoria.icone || '📦'}</span>
                <h3 className="categoria-card-nome">{categoria.nome}</h3>
                <p className="categoria-card-descricao">
                  {categoria.observacao || 'Confira os leilões desta categoria.'}
                </p>
                <h2 className="clique-aqui">Clique aqui</h2>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
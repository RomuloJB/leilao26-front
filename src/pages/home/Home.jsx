import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

// Por enquanto só existe a categoria "Gado". Novas categorias podem
// ser adicionadas aqui futuramente sem alterar o restante da página.
const categorias = [
  {
    id: 'gado',
    nome: 'Gado',
    descricao: 'Leilões de bovinos de corte e de leite direto da fazenda.',
    rota: '/leiloes/gado',
    icone: '🐄',
  },
];

export default function Home() {
  const { autenticado, usuario, logout } = useAuth();

  const atual = new Date();
  const dataAtual = atual.toLocaleDateString("pt-BR");
  const horaAtual = atual.toLocaleTimeString("pt-BR");

  return (
    <div className="home-page">
      <header className="home-header">
        <span className="home-logo">FarmAuction</span>

        <nav className="home-nav">
          {autenticado ? (
            <div className="home-usuario">
              <span className="home-usuario-nome">
                Olá, {usuario?.username}
              </span>
              <button className="home-botao-sair" onClick={logout} type="button">
                Sair
              </button>
            </div>
          ) : (
            <Link className="home-botao-entrar" to="/login">
              Entrar
            </Link>
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
            Encontre e dê lances nos melhores leilões de animais direto da
            fazenda.
          </p>
        </section>

        <section className="home-categorias">
          <h2 className="home-categorias-titulo">Categorias de leilões</h2>

          <div className="home-categorias-grid">
            {categorias.map((categoria) => (
              // O Link aponta para uma rota protegida. Se o usuário não
              // estiver autenticado, o ProtectedRoute cuida do redirect
              // automático para /login.
              <Link
                key={categoria.id}
                to={categoria.rota}
                className="categoria-card"
              >
                <span className="categoria-card-icone" aria-hidden="true">
                  {categoria.icone}
                </span>
                <h3 className="categoria-card-nome">{categoria.nome}</h3>
                <p className="categoria-card-descricao">
                  {categoria.descricao}
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
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export default function Header() {
  const { autenticado, usuario, logout } = useAuth();

  return (
    <header className="header">
      <Link className="header-logo" to="/">FarmAuction</Link>
      <nav className="header-nav">
        {autenticado ? (
          <div className="header-usuario">
            <span className="header-usuario-nome">Olá, {usuario?.username}</span>
            <button className="header-botao-sair" onClick={logout} type="button">Sair</button>
          </div>
        ) : (
          <Link className="header-botao-entrar" to="/login">Entrar</Link>
        )}
      </nav>
    </header>
  );
}

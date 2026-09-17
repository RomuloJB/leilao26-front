import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-conteudo">
        <span className="footer-logo">FarmAuction</span>
        <nav className="footer-nav">
          <Link className="footer-link" to="/">Início</Link>
          <Link className="footer-link" to="/login">Entrar</Link>
          <Link className="footer-link" to="/cadastro">Cadastre-se</Link>
        </nav>
      </div>
      <p className="footer-copyright">
        © {anoAtual} FarmAuction. Todos os direitos reservados.
      </p>
    </footer>
  );
}

import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider} from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/login/Login.jsx';
import Cadastro from './pages/cadastro/Cadastro.jsx';
import Home from './pages/home/Home.jsx';
import Leiloes from './pages/leiloes/Leiloes.jsx';
import NovoLeilao from "./components/leilao/NovoLeilao";
import LeilaoDetalhes from './pages/leiloes/LeilaoDetalhes.jsx';
import EditarLeilao from './pages/leiloes/EditarLeilao';
import RecuperarSenha from './pages/senha/RecuperarSenha';
import AlterarSenha from './pages/senha/AlterarSenha';
import AdminCategorias from './pages/admin/AdminCategorias.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Home: pública, mas o card de "Gado" leva a uma rota protegida */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas protegidas: só acessíveis após login */}
          <Route path="/leiloes/gado" element={<ProtectedRoute> <Leiloes/> </ProtectedRoute>}/>
          <Route path="/leiloes/novo" element={<ProtectedRoute><NovoLeilao /></ProtectedRoute>} />
          <Route path="/leiloes/:id/editar" element={<ProtectedRoute><NovoLeilao /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute> {/* <Admin /> */} <div>Área administrativa</div> </ProtectedRoute>}/>
          <Route path="/leiloes/:id" element={<ProtectedRoute> <LeilaoDetalhes/> </ProtectedRoute>}/>
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/alterar-senha" element={<AlterarSenha />} />
          <Route path="/leiloes/categoria/:categoriaId" element={<ProtectedRoute><Leiloes/></ProtectedRoute>}/>
          <Route path="/admin/categorias" element={<ProtectedRoute perfilExigido="ADMIN"><AdminCategorias/></ProtectedRoute>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
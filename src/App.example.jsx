// Este arquivo é um EXEMPLO de como plugar as peças no seu App.jsx real.
// Adapte os imports e as demais rotas para o que já existe no seu projeto.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

// Suas páginas existentes:
// import Home from './pages/Home';
// import Admin from './pages/Admin';

function LogoutButton() {
  const { logout } = useAuth();
  return (
    <button onClick={logout}>
      Sair
    </button>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas: só acessíveis após login */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                {/* <Admin /> */}
                <div>Área administrativa</div>
              </ProtectedRoute>
            }
          />

          {/* Rota pública, ex.: home / lista de leilões */}
          {/* <Route path="/" element={<Home />} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

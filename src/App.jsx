import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

import Categoria from './components/categoria/Categoria';


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

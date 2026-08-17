import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Uso: <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
export default function ProtectedRoute({ children, perfilExigido }) {
  const { autenticado, carregando, usuario } = useAuth();

  if (carregando) {
    // Evita redirecionar pro login antes de terminar de checar o localStorage
    return <div className="protected-route-loading">Carregando...</div>;
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  if (perfilExigido && !usuario?.roles?.includes(perfilExigido)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

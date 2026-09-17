import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Uso:
//   <ProtectedRoute><Leiloes /></ProtectedRoute>                          -> qualquer usuário logado
//   <ProtectedRoute perfilExigido="ADMIN">...</ProtectedRoute>            -> só ADMIN
//   <ProtectedRoute perfilExigido={["VENDEDOR", "ADMIN"]}>...</ProtectedRoute> -> qualquer um dos dois
export default function ProtectedRoute({ children, perfilExigido }) {
  const { autenticado, carregando, temPerfil } = useAuth();

  if (carregando) {
    // Evita redirecionar pro login antes de terminar de checar o localStorage
    return <div className="protected-route-loading">Carregando...</div>;
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  if (perfilExigido) {
    const perfisPermitidos = Array.isArray(perfilExigido) ? perfilExigido : [perfilExigido];
    if (!perfisPermitidos.some(temPerfil)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

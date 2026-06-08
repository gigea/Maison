import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  if (!user)    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

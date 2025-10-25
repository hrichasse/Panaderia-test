import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Componente que protege rutas basadas en roles específicos
 * Uso: <RoleRoute allow={['admin']} />
 * 
 * @param {Array} allow - Roles permitidos (ej: ['admin'], ['cliente'], ['admin', 'cliente'])
 */
export default function RoleRoute({ allow = [] }) {
  const { user, isAuthenticated } = useAuth();
  
  // Si no está logueado, redirigir a login
  if (!isAuthenticated) {
    const currentPath = window.location.pathname;
    sessionStorage.setItem('redirect_after_login', currentPath);
    return <Navigate to="/login" replace />;
  }
  
  // Si está logueado pero no tiene el rol correcto, redirigir a home
  if (!allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  // Si tiene el rol correcto, renderizar contenido
  return <Outlet />;
}

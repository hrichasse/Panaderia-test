import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Componente que protege rutas que requieren autenticación
 * Si el usuario NO está logueado, redirige a /login
 * Si está logueado, renderiza los componentes hijos
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Guardar la ruta intentada para redirigir después del login
    const currentPath = window.location.pathname;
    sessionStorage.setItem('redirect_after_login', currentPath);
    
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}

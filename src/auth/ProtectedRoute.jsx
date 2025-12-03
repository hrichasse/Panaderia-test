import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Protege rutas que requieren autenticación.
 * Uso recomendado (anidado):
 * <Route element={<ProtectedRoute />}>\n  <Route path="/mi-cuenta" element={<MiCuenta />} />\n</Route>
 * También soporta el patrón directo usado actualmente: <Route path="/mi-cuenta" element={<ProtectedRoute><MiCuenta /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    const currentPath = window.location.pathname;
    sessionStorage.setItem('redirect_after_login', currentPath);
    return <Navigate to="/login" replace />;
  }

  // Si se pasaron children (patrón envolvente), retornarlos.
  // Si no, usar <Outlet /> para el patrón de rutas anidadas.
  return children ? children : <Outlet />;
}

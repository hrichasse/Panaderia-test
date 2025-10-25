import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import RoleRoute from './auth/RoleRoute';

// Páginas
import Login from './pages/Login';
import MiCuenta from './pages/MiCuenta';
import AdminPanel from './pages/AdminPanel';

// Componente Home (página pública actual)
import Home from './components/Home';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas (requieren login) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/mi-cuenta" element={<MiCuenta />} />
      </Route>

      {/* Rutas solo para ADMIN */}
      <Route element={<RoleRoute allow={['admin']} />}>
        <Route path="/admin" element={<AdminPanel />} />
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import RoleRoute from './auth/RoleRoute';

// Páginas
import Login from './pages/Login';
import MiCuenta from './pages/MiCuenta';
import AdminPanel from './pages/AdminPanel';
import Orders from './pages/Orders';
import OrderConfirmation from './pages/OrderConfirmation';
import ProductDetail from './pages/ProductDetail';

// Componente Home (página pública actual)
import Home from './components/Home';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login />} />
      <Route path="/products/:id" element={<ProductDetail />} />

      {/* Rutas protegidas (requieren login) */}
      <Route path="/mi-cuenta" element={<ProtectedRoute><MiCuenta /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />

      {/* Rutas solo para ADMIN */}
      <Route element={<RoleRoute allow={['admin']} />}>
        <Route path="/admin" element={<AdminPanel />} />
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes';

function App() {
  const location = useLocation();

  // No mostrar Header/Footer en páginas de autenticación
  const hideHeaderFooter = location.pathname === '/login';

  return (
    <div>
      {!hideHeaderFooter && <Header />}
      
      <AppRoutes />
      
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;

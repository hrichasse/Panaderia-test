import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Header({ cartCount, onCartClick }) {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    // Si estamos en otra página, navegar a home primero
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header>
      <nav className="container">
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          Pastelería Mil Sabores
        </Link>
        <ul className="nav-links">
          <li><a onClick={() => scrollToSection('inicio')}>Inicio</a></li>
          <li><a onClick={() => scrollToSection('categorias')}>Categorías</a></li>
          <li><a onClick={() => scrollToSection('productos')}>Productos</a></li>
          <li><a onClick={() => scrollToSection('nosotros')}>Nosotros</a></li>
          <li><a onClick={() => scrollToSection('contacto')}>Contacto</a></li>
          
          {/* Botones de autenticación */}
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/mi-cuenta" style={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <i className="fas fa-user"></i>
                  <span>{user?.name.split(' ')[0]}</span>
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" style={{ 
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <i className="fas fa-cog"></i>
                    <span>Admin</span>
                  </Link>
                </li>
              )}
              <li>
                <a onClick={logout} style={{ cursor: 'pointer' }}>
                  <i className="fas fa-sign-out-alt"></i> Salir
                </a>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" style={{ 
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-user"></i>
                <span>Ingresar</span>
              </Link>
            </li>
          )}
          
          <li className="cart-icon" onClick={onCartClick}>
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{cartCount}</span>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

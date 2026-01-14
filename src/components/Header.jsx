import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../context/CartContext';

function Header() {
  const { isAuthenticated, isAdmin, user, logout, getProfile } = useAuth();
  const { cartCount, setCartOpen } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !user?.name) {
      getProfile();
    }
  }, [isAuthenticated, user, getProfile]);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false); // Cerrar menú al hacer clic
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
      <nav className="container" style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
      }}>
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          Pastelería Mil Sabores
        </Link>

        {/* Botón menú hamburguesa para móvil */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          <i className={`fas fa-${mobileMenuOpen ? 'times' : 'bars'}`}></i>
        </button>

        <ul className="nav-links" style={{
          display: windowWidth > 768 ? 'flex' : (mobileMenuOpen ? 'flex' : 'none'),
          flexDirection: windowWidth > 768 ? 'row' : 'column',
          position: windowWidth > 768 ? 'static' : 'absolute',
          top: windowWidth > 768 ? 'auto' : '100%',
          left: 0,
          right: 0,
          background: windowWidth > 768 ? 'transparent' : 'linear-gradient(135deg, var(--accent-chocolate), var(--accent-chocolate-hover))',
          width: windowWidth > 768 ? 'auto' : '100%',
          padding: windowWidth > 768 ? '0' : '1rem 0',
          margin: 0,
          listStyle: 'none',
          maxHeight: windowWidth > 768 ? 'none' : (mobileMenuOpen ? '500px' : '0'),
          overflow: windowWidth > 768 ? 'visible' : 'hidden',
          transition: windowWidth > 768 ? 'none' : 'max-height 0.3s ease',
          zIndex: 999,
          gap: windowWidth > 768 ? '2rem' : '0'
        }}>
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
          
          <li className="cart-icon" onClick={() => {
            setCartOpen(true);
            setMobileMenuOpen(false);
          }}>
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{cartCount}</span>
          </li>
        </ul>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          header nav {
            position: relative;
          }

          .mobile-menu-toggle {
            display: block !important;
          }

          .nav-links li {
            width: 100%;
            text-align: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }

          .nav-links a {
            display: block;
            padding: 0.5rem 1rem;
            cursor: pointer;
          }

          .cart-icon {
            padding: 0.75rem 1rem;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-toggle {
            display: none !important;
          }

          .nav-links {
            position: static !important;
            flex-direction: row !important;
            gap: 2rem !important;
            background: transparent !important;
            padding: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }

          .nav-links li {
            border-bottom: none !important;
          }
        }

        @media (max-width: 480px) {
          .logo {
            font-size: 1.1rem;
          }

          .mobile-menu-toggle {
            font-size: 1.2rem !important;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;

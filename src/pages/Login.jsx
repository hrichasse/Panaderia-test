import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Login() {
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(location.pathname.toLowerCase().includes('register'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsRegistering(location.pathname.toLowerCase().includes('register'));
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }
        if (formData.password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        if (!formData.name || formData.name.length < 2) {
          throw new Error('El nombre debe tener al menos 2 caracteres');
        }
        
        const result = await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
        if (!result.success) throw new Error(result.message);
      } else {
        const result = await login(formData.email.trim(), formData.password);
        if (!result.success) throw new Error(result.message);
      }

      // Redirigir a la página intentada originalmente o al home
      const redirectPath = sessionStorage.getItem('redirect_after_login') || '/';
      sessionStorage.removeItem('redirect_after_login');
      navigate(redirectPath, { replace: true });
      
    } catch (err) {
      setError(err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Placeholder para integración social
    console.log(`Iniciando sesión con ${provider}`);
    setError(`Integración con ${provider} próximamente`);
  };

  const isBlocked = false;

  return (
    <div className="login-page" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #D4A373 0%, #E8C5A0 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%'
      }}>
        {/* Header con decoración y título */}
        <div style={{
          background: 'linear-gradient(135deg, #8B6F47 0%, #A0825A 100%)',
          borderRadius: '25px 25px 0 0',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decoración de fondo */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '20px',
            opacity: '0.15',
            fontSize: '4rem'
          }}>
            🎂
          </div>
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: '0.15',
            fontSize: '4rem'
          }}>
            🧁
          </div>
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '20px',
            opacity: '0.15',
            fontSize: '4rem'
          }}>
            🍪
          </div>

          {/* Iconos decorativos principales */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '1.5rem',
            fontSize: '3rem'
          }}>
            <span style={{ animation: 'float 3s ease-in-out infinite' }}>🍰</span>
            <span style={{ animation: 'float 3s ease-in-out infinite 0.5s' }}>🧁</span>
            <span style={{ animation: 'float 3s ease-in-out infinite 1s' }}>🍪</span>
          </div>

          <h1 style={{ 
            fontFamily: 'Pacifico, cursive', 
            color: 'var(--accent-chocolate)',
            fontSize: '2.5rem',
            marginBottom: '0.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            margin: '0.5rem 0'
          }}>
            {isRegistering ? 'Crear Cuenta' : 'Pastelería Mil Sabores'}
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1rem',
            marginBottom: 0,
            fontWeight: '500'
          }}>
            {isRegistering ? 'Únete a nuestra comunidad de amantes del buen gusto' : 'Los mejores postres artesanales te esperan'}
          </p>
        </div>

        {/* Formulario */}
        <div className="login-container" style={{
          background: 'var(--white)',
          borderRadius: '0 0 25px 25px',
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
        }}>

          {error && (
            <div style={{
              padding: '0.9rem 1rem',
              marginBottom: '1.5rem',
              background: '#ffe0e0',
              border: '2px solid #ff9999',
              borderRadius: '10px',
              color: '#c33',
              fontSize: '0.9rem',
              animation: 'slideDown 0.3s ease'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: 'var(--primary-text-color)',
                  fontSize: '0.95rem'
                }}>
                  👤 Nombre Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={isRegistering}
                  disabled={isBlocked || loading}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid #E8D5C4',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-chocolate)'}
                  onBlur={(e) => e.target.style.borderColor = '#E8D5C4'}
                  placeholder="Tu nombre completo"
                />
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--primary-text-color)',
                fontSize: '0.95rem'
              }}>
                ✉️ Email o Usuario
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isBlocked || loading}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  border: '2px solid #E8D5C4',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-chocolate)'}
                onBlur={(e) => e.target.style.borderColor = '#E8D5C4'}
                placeholder="tu@email.com"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--primary-text-color)',
                fontSize: '0.95rem'
              }}>
                🔐 Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isBlocked || loading}
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  border: '2px solid #E8D5C4',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-chocolate)'}
                onBlur={(e) => e.target.style.borderColor = '#E8D5C4'}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {isRegistering && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: 'var(--primary-text-color)',
                  fontSize: '0.95rem'
                }}>
                  🔐 Confirmar Contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={isRegistering}
                  disabled={isBlocked || loading}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid #E8D5C4',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-chocolate)'}
                  onBlur={(e) => e.target.style.borderColor = '#E8D5C4'}
                  placeholder="Repite tu contraseña"
                />
              </div>
            )}

            {!isRegistering && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: 'var(--primary-text-color)',
                  fontSize: '0.95rem'
                }}>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    style={{
                      cursor: 'pointer',
                      width: '18px',
                      height: '18px',
                      accentColor: 'var(--accent-chocolate)'
                    }}
                  />
                  Recuérdame
                </label>
                <Link
                  to="/forgot-password"
                  style={{
                    color: 'var(--accent-chocolate)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={isBlocked || loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: isBlocked || loading ? '#ccc' : 'var(--accent-chocolate)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: isBlocked || loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                marginBottom: '1.5rem',
                boxShadow: isBlocked || loading ? 'none' : '0 4px 15px rgba(139, 69, 19, 0.3)',
                transform: loading ? 'scale(0.98)' : 'scale(1)'
              }}
              onMouseOver={(e) => {
                if (!isBlocked && !loading) {
                  e.target.style.background = 'var(--accent-chocolate-hover)';
                  e.target.style.boxShadow = '0 6px 20px rgba(139, 69, 19, 0.4)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                if (!isBlocked && !loading) {
                  e.target.style.background = 'var(--accent-chocolate)';
                  e.target.style.boxShadow = '0 4px 15px rgba(139, 69, 19, 0.3)';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? '⏳ Procesando...' : (isRegistering ? '✨ Crear Cuenta' : '🔓 LOGIN')}
            </button>

            {/* Separador */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ flex: 1, height: '1px', background: '#E8D5C4' }}></div>
              <span style={{ color: '#999', fontSize: '0.9rem' }}>o también</span>
              <div style={{ flex: 1, height: '1px', background: '#E8D5C4' }}></div>
            </div>

            {!isRegistering && (
              <>
                {/* Botones de redes sociales */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    disabled={loading}
                    style={{
                      padding: '0.85rem',
                      background: '#F5E6D3',
                      border: '2px solid #E8D5C4',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      color: 'var(--primary-text-color)',
                      opacity: loading ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.background = '#E8D5C4';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.target.style.background = '#F5E6D3';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/300/300221.png" 
                      alt="Google" 
                      style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                    />
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Facebook')}
                    disabled={loading}
                    style={{
                      padding: '0.85rem',
                      background: '#F5E6D3',
                      border: '2px solid #E8D5C4',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      color: 'var(--primary-text-color)',
                      opacity: loading ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.background = '#E8D5C4';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.target.style.background = '#F5E6D3';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/3670/3670144.png" 
                      alt="Facebook" 
                      style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                    />
                    Facebook
                  </button>
                </div>
              </>
            )}

            {/* Enlace de registro/login */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                  setFormData({ name: '', email: '', password: '', confirmPassword: '', rememberMe: false });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-chocolate)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                {isRegistering ? '¿Ya tienes cuenta? Inicia sesión aquí' : '¿No tienes cuenta? Regístrate aquí'}
              </button>
            </div>

            {/* Link para volver */}
            <div style={{ 
              textAlign: 'center', 
              paddingTop: '1rem', 
              borderTop: '1px solid #E8D5C4'
            }}>
              <Link 
                to="/"
                style={{
                  color: 'var(--accent-chocolate)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                ← Volver al inicio
              </Link>
            </div>
          </form>


        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Estilos responsivos */
        @media (max-width: 480px) {
          div[style*="maxWidth: '480px'"] {
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;

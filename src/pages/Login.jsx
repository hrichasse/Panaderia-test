import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, loginAttempts } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validaciones del lado del cliente
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
      }

      if (!isRegistering) {
        // MODO LOGIN - validar con usuarios existentes
        // Determinar el rol basado en el email
        const role = formData.email.endsWith('@admin.com') ? 'admin' : 'cliente';

        // Intentar login (validará credenciales)
        await login({
          name: formData.name || formData.email.split('@')[0],
          email: formData.email,
          password: formData.password,
          role
        });
      } else {
        // MODO REGISTRO - crear nuevo usuario
        // En este caso simulado, el registro usa las mismas validaciones
        // En producción, aquí harías POST /api/register
        const role = formData.email.endsWith('@admin.com') ? 'admin' : 'cliente';
        
        await login({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role
        });
      }

      // Redirigir a la página intentada originalmente o al home
      const redirectPath = sessionStorage.getItem('redirect_after_login') || '/';
      sessionStorage.removeItem('redirect_after_login');
      navigate(redirectPath, { replace: true });
      
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // Bloquear si hay demasiados intentos
  const isBlocked = loginAttempts >= 5;

  return (
    <div className="login-page" style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, var(--primary-bg-color) 0%, #fff 100%)'
    }}>
      <div className="container">
        <div className="login-container" style={{
          maxWidth: '450px',
          margin: '0 auto',
          padding: '2.5rem',
          background: 'var(--white)',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ 
              fontFamily: 'Pacifico, cursive', 
              color: 'var(--accent-chocolate)',
              fontSize: '2.5rem',
              marginBottom: '0.5rem'
            }}>
              {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h1>
            <p style={{ color: 'var(--primary-text-color)' }}>
              Pastelería Mil Sabores
            </p>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              color: '#c33',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          {isBlocked && (
            <div style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              background: '#fef3e0',
              border: '1px solid #f5c66d',
              borderRadius: '8px',
              color: '#8b4513',
              fontSize: '0.9rem'
            }}>
              Demasiados intentos. Espera 5 minutos antes de volver a intentar.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: 'var(--primary-text-color)'
                }}>
                  Nombre Completo
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
                    padding: '0.75rem 1rem',
                    border: '2px solid var(--accent-pink)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s'
                  }}
                  placeholder="Tu nombre completo"
                />
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--primary-text-color)'
              }}>
                Email
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
                  padding: '0.75rem 1rem',
                  border: '2px solid var(--accent-pink)',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="tu@email.com"
              />
              <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                💡 Usa @admin.com para acceso de administrador
              </small>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--primary-text-color)'
              }}>
                Contraseña
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
                  padding: '0.75rem 1rem',
                  border: '2px solid var(--accent-pink)',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {isRegistering && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: 'var(--primary-text-color)'
                }}>
                  Confirmar Contraseña
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
                    padding: '0.75rem 1rem',
                    border: '2px solid var(--accent-pink)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="Repite tu contraseña"
                />
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
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: isBlocked || loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s',
                marginBottom: '1rem'
              }}
              onMouseOver={(e) => {
                if (!isBlocked && !loading) {
                  e.target.style.background = 'var(--accent-chocolate-hover)';
                }
              }}
              onMouseOut={(e) => {
                if (!isBlocked && !loading) {
                  e.target.style.background = 'var(--accent-chocolate)';
                }
              }}
            >
              {loading ? 'Procesando...' : (isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión')}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-chocolate)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
              </button>
            </div>
          </form>

          {/* Información de usuarios de prueba */}
          {!isRegistering && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: '#f0f8ff',
              borderRadius: '10px',
              border: '2px dashed var(--accent-pink)',
              fontSize: '0.9rem'
            }}>
              <h4 style={{ 
                margin: '0 0 1rem',
                color: 'var(--accent-chocolate)',
                fontSize: '1rem',
                textAlign: 'center'
              }}>
                🧪 Usuarios de Prueba
              </h4>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: 'white', borderRadius: '6px' }}>
                  <strong style={{ color: 'var(--accent-chocolate)' }}>Cliente:</strong>
                  <br />
                  📧 cliente@email.com
                  <br />
                  🔑 123456
                </div>
                <div style={{ padding: '0.75rem', background: 'white', borderRadius: '6px' }}>
                  <strong style={{ color: 'var(--accent-chocolate)' }}>Admin:</strong>
                  <br />
                  📧 admin@admin.com
                  <br />
                  🔑 admin123
                </div>
              </div>
            </div>
          )}

          <div style={{ 
            marginTop: '2rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid #eee',
            textAlign: 'center'
          }}>
            <Link 
              to="/"
              style={{
                color: 'var(--accent-chocolate)',
                textDecoration: 'none',
                fontSize: '0.95rem'
              }}
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

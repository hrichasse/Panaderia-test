import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function MiCuenta() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, sessionTimeRemaining } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || ''
    }
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
        country: user?.address?.country || ''
      }
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setMessage({ text: 'Perfil actualizado exitosamente', type: 'success' });
      setIsEditing(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: error.message || 'Error al actualizar perfil', type: 'error' });
    }
  };

  return (
    <div className="mi-cuenta-page" style={{ minHeight: '80vh', padding: '3rem 0' }}>
      <div className="container">
        <h1 style={{
          fontFamily: 'Pacifico, cursive',
          color: 'var(--accent-chocolate)',
          fontSize: '2.5rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Mi Cuenta
        </h1>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Información del Perfil */}
          <div style={{
            background: 'var(--white)',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ 
                color: 'var(--accent-chocolate)',
                fontSize: '1.5rem',
                margin: 0
              }}>
                Perfil
              </h2>
              <span style={{
                padding: '0.25rem 0.75rem',
                background: user?.role === 'admin' ? 'var(--accent-chocolate)' : 'var(--accent-pink)',
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
              </span>
            </div>

            {message.text && (
              <div style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '8px',
                color: message.type === 'success' ? '#155724' : '#721c24',
                fontSize: '0.9rem'
              }}>
                {message.text}
              </div>
            )}

            {!isEditing ? (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block',
                    fontWeight: '600',
                    color: 'var(--primary-text-color)',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                  }}>
                    Nombre
                  </label>
                  <p style={{ 
                    fontSize: '1.1rem',
                    margin: 0,
                    color: 'var(--accent-chocolate)'
                  }}>
                    {user?.name}
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block',
                    fontWeight: '600',
                    color: 'var(--primary-text-color)',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                  }}>
                    Email
                  </label>
                  <p style={{ 
                    fontSize: '1.1rem',
                    margin: 0,
                    color: 'var(--accent-chocolate)'
                  }}>
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'var(--accent-chocolate)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'background 0.3s'
                  }}
                >
                  Editar Perfil
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block',
                    fontWeight: '600',
                    color: 'var(--primary-text-color)',
                    marginBottom: '0.5rem'
                  }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid var(--accent-pink)',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block',
                    fontWeight: '600',
                    color: 'var(--primary-text-color)',
                    marginBottom: '0.5rem'
                  }}>
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid var(--accent-pink)',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block',
                    fontWeight: '600',
                    color: 'var(--primary-text-color)',
                    marginBottom: '0.5rem'
                  }}>
                    Calle
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid var(--accent-pink)',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block',
                    fontWeight: '600',
                    color: 'var(--primary-text-color)',
                    marginBottom: '0.5rem'
                  }}>
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid var(--accent-pink)',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--accent-chocolate)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || '',
                        phone: user?.phone || '',
                        address: {
                          street: user?.address?.street || '',
                          city: user?.address?.city || '',
                          state: user?.address?.state || '',
                          zipCode: user?.address?.zipCode || '',
                          country: user?.address?.country || ''
                        }
                      });
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: '#ccc',
                      color: '#333',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div style={{ 
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #eee'
            }}>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                Tiempo de sesión restante: <strong>{sessionTimeRemaining} minutos</strong>
              </p>
              <button
                onClick={logout}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  color: '#c33',
                  border: '2px solid #c33',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Historial de Pedidos */}
          <div style={{
            background: 'var(--white)',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              color: 'var(--accent-chocolate)',
              fontSize: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              Mis Pedidos
            </h2>
            <p style={{ color: '#666', textAlign: 'center', padding: '1rem' }}>
              <button
                onClick={() => navigate('/orders')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--accent-chocolate)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Ver mis órdenes
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiCuenta;

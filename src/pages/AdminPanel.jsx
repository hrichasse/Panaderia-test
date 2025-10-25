import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { products as initialProducts } from '../data/products';

function AdminPanel() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('productos'); // 'productos' | 'pedidos' | 'estadisticas'
  const [products, setProducts] = useState(initialProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Pedidos simulados
  const pedidosSimulados = [
    { id: 1, cliente: 'María González', email: 'maria@email.com', producto: 'Torta de Chocolate', cantidad: 1, total: 45000, estado: 'Pendiente', fecha: '2025-10-25' },
    { id: 2, cliente: 'Carlos Ramírez', email: 'carlos@email.com', producto: 'Mousse de Chocolate', cantidad: 3, total: 15000, estado: 'Procesando', fecha: '2025-10-24' },
    { id: 3, cliente: 'Sofía Martínez', email: 'sofia@email.com', producto: 'Torta Vegana', cantidad: 1, total: 50000, estado: 'Entregado', fecha: '2025-10-23' }
  ];

  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
    setShowAddForm(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (editingProduct.id) {
      // Actualizar existente
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    } else {
      // Crear nuevo
      const newProduct = {
        ...editingProduct,
        id: Math.max(...products.map(p => p.id)) + 1
      };
      setProducts([...products, newProduct]);
    }
    setEditingProduct(null);
    setShowAddForm(false);
  };

  return (
    <div className="admin-panel" style={{ minHeight: '80vh', padding: '3rem 0', background: 'var(--primary-bg-color)' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontFamily: 'Pacifico, cursive',
            color: 'var(--accent-chocolate)',
            fontSize: '2.5rem',
            margin: 0
          }}>
            Panel de Administración
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--primary-text-color)', fontWeight: '600' }}>
              {user?.name}
            </span>
            <button
              onClick={logout}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                color: '#c33',
                border: '2px solid #c33',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '2px solid #ddd'
        }}>
          {['productos', 'pedidos', 'estadisticas'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '1rem 2rem',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid var(--accent-chocolate)' : '3px solid transparent',
                color: activeTab === tab ? 'var(--accent-chocolate)' : '#666',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: activeTab === tab ? '700' : '400',
                textTransform: 'capitalize',
                transition: 'all 0.3s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contenido Productos */}
        {activeTab === 'productos' && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{ color: 'var(--accent-chocolate)', margin: 0 }}>
                Gestión de Productos ({products.length})
              </h2>
              <button
                onClick={() => {
                  setEditingProduct({ name: '', price: 0, category: 'tortas-cuadradas', description: '', image: '' });
                  setShowAddForm(true);
                }}
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
                + Agregar Producto
              </button>
            </div>

            {showAddForm && (
              <div style={{
                background: 'var(--white)',
                padding: '2rem',
                borderRadius: '15px',
                marginBottom: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-chocolate)' }}>
                  {editingProduct?.id ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <form onSubmit={handleSaveProduct}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Nombre</label>
                      <input
                        type="text"
                        required
                        value={editingProduct?.name || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid var(--accent-pink)',
                          borderRadius: '8px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Precio (CLP)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={editingProduct?.price || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid var(--accent-pink)',
                          borderRadius: '8px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Categoría</label>
                      <select
                        required
                        value={editingProduct?.category || 'tortas-cuadradas'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid var(--accent-pink)',
                          borderRadius: '8px'
                        }}
                      >
                        <option value="tortas-cuadradas">Tortas Cuadradas</option>
                        <option value="tortas-circulares">Tortas Circulares</option>
                        <option value="postres-individuales">Postres Individuales</option>
                        <option value="sin-azucar">Sin Azúcar</option>
                        <option value="tradicional">Tradicional</option>
                        <option value="sin-gluten">Sin Gluten</option>
                        <option value="vegana">Vegana</option>
                        <option value="especiales">Especiales</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Descripción</label>
                    <textarea
                      required
                      rows={3}
                      value={editingProduct?.description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid var(--accent-pink)',
                        borderRadius: '8px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <button
                      type="submit"
                      style={{
                        padding: '0.75rem 2rem',
                        background: 'var(--accent-chocolate)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingProduct(null);
                      }}
                      style={{
                        padding: '0.75rem 2rem',
                        background: '#ccc',
                        color: '#333',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div style={{ 
              background: 'var(--white)',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--accent-chocolate)', color: 'white' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Nombre</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Categoría</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Precio</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} style={{ borderBottom: '1px solid #eee', background: index % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '1rem' }}>{product.id}</td>
                      <td style={{ padding: '1rem', fontWeight: '600' }}>{product.name}</td>
                      <td style={{ padding: '1rem' }}>{product.category}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700' }}>${product.price.toLocaleString()}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleEditProduct(product)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--accent-pink)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            marginRight: '0.5rem'
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#c33',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contenido Pedidos */}
        {activeTab === 'pedidos' && (
          <div>
            <h2 style={{ color: 'var(--accent-chocolate)', marginBottom: '2rem' }}>
              Gestión de Pedidos ({pedidosSimulados.length})
            </h2>
            <div style={{ 
              background: 'var(--white)',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--accent-chocolate)', color: 'white' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Cliente</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Producto</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Total</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Estado</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosSimulados.map((pedido, index) => (
                    <tr key={pedido.id} style={{ borderBottom: '1px solid #eee', background: index % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '1rem' }}>#{pedido.id}</td>
                      <td style={{ padding: '1rem', fontWeight: '600' }}>{pedido.cliente}</td>
                      <td style={{ padding: '1rem' }}>{pedido.email}</td>
                      <td style={{ padding: '1rem' }}>{pedido.producto} x{pedido.cantidad}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700' }}>${pedido.total.toLocaleString()}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.5rem 1rem',
                          background: pedido.estado === 'Entregado' ? '#d4edda' : pedido.estado === 'Procesando' ? '#fff3cd' : '#f8d7da',
                          color: pedido.estado === 'Entregado' ? '#155724' : pedido.estado === 'Procesando' ? '#856404' : '#721c24',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          {pedido.estado}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>{pedido.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contenido Estadísticas */}
        {activeTab === 'estadisticas' && (
          <div>
            <h2 style={{ color: 'var(--accent-chocolate)', marginBottom: '2rem' }}>
              Estadísticas
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <div style={{
                background: 'var(--white)',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: 'var(--accent-chocolate)', fontSize: '3rem', margin: '0 0 0.5rem' }}>
                  {products.length}
                </h3>
                <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>Productos Totales</p>
              </div>
              <div style={{
                background: 'var(--white)',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: 'var(--accent-chocolate)', fontSize: '3rem', margin: '0 0 0.5rem' }}>
                  {pedidosSimulados.length}
                </h3>
                <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>Pedidos Totales</p>
              </div>
              <div style={{
                background: 'var(--white)',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: 'var(--accent-chocolate)', fontSize: '3rem', margin: '0 0 0.5rem' }}>
                  ${pedidosSimulados.reduce((sum, p) => sum + p.total, 0).toLocaleString()}
                </h3>
                <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>Ventas Totales (CLP)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/products/${id}`);
        if (!mounted) return;
        setProduct(data?.data?.product);
        setError('');
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.message || 'Error al cargar el producto');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, id: product._id });
      navigate('/');
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Cargando producto...</div>;
  if (error) return <div style={{ padding: '3rem', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!product) return <div style={{ padding: '3rem', textAlign: 'center' }}>Producto no encontrado</div>;

  return (
    <div className="container" style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '2rem',
          padding: '0.5rem 1rem',
          background: 'transparent',
          border: '2px solid var(--accent-chocolate)',
          borderRadius: '8px',
          color: 'var(--accent-chocolate)',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
        }}
      >
        ← Volver
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        <div>
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
          )}
        </div>
        <div>
          <h1 style={{ fontFamily: 'Pacifico, cursive', color: 'var(--accent-chocolate)', marginBottom: '1rem' }}>
            {product.name}
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1.5rem' }}>{product.description}</p>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-chocolate)', marginBottom: '1rem' }}>
            ${product.price.toLocaleString()}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
            Categoría: <strong>{product.category}</strong>
          </p>
          <p style={{ fontSize: '0.9rem', color: product.stock > 0 ? 'green' : 'red', marginBottom: '2rem' }}>
            {product.stock > 0 ? `Stock disponible: ${product.stock}` : 'Sin stock'}
          </p>
          {product.isActive && product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              style={{
                padding: '1rem 2rem',
                background: 'var(--accent-chocolate)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600',
                transition: 'background 0.3s',
              }}
            >
              Agregar al Carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

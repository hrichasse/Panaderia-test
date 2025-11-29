import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart({ cart, isOpen, onClose, onUpdateQuantity, onCheckout }) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const getImagePath = (imageName) => {
    try {
      return new URL(`../assets/pasteles/${imageName}`, import.meta.url).href;
    } catch (e) {
      console.error(`Error loading image: ${imageName}`, e);
      return '';
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`} id="cartSidebar">
      <div className="cart-header">
        <h2>Carrito de Compras</h2>
        <button className="close-cart" onClick={onClose}>&times;</button>
      </div>
      
      <div className="cart-content">
        <div id="cartItems">
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#8B4513', marginTop: '2rem' }}>
              Tu carrito está vacío
            </p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={getImagePath(item.image)} alt={item.name} />
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.name}</h4>
                  <p className="cart-item-price">${item.price.toLocaleString()}</p>
                  <div className="quantity-controls">
                    <button className="quantity-btn" onClick={() => onUpdateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => onUpdateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="cart-total">
          <p>Total: <span id="cartTotal">${total.toLocaleString()}</span></p>
          
          {error && (
            <div style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              background: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '8px',
              color: '#721c24',
              fontSize: '0.9rem',
              wordBreak: 'break-word'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Método de pago</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Calle</label>
            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Número</label>
            <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Ciudad</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Notas (opcional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <button
            className="checkout-btn"
            id="checkoutBtn"
            disabled={loading}
            onClick={async () => {
              setError('');
              setLoading(true);
              
              console.log('Iniciando checkout con:', { paymentMethod, street, number, city, notes });
              
              // Validación básica de campos requeridos
              if (!street || !city) {
                setError('Por favor completa la dirección (calle y ciudad son obligatorios)');
                setLoading(false);
                return;
              }
              
              const res = await onCheckout({
                paymentMethod,
                deliveryAddress: { street, number, city },
                notes,
              });
              
              console.log('Resultado del checkout:', res);
              
              setLoading(false);
              
              if (res?.success && res?.order) {
                navigate('/order-confirmation', { state: { order: res.order } });
              } else {
                const errorMsg = res?.message || 'No se pudo completar la compra';
                const statusInfo = res?.statusCode ? ` (Código: ${res.statusCode})` : '';
                const detailsInfo = res?.details ? `\n\nDetalles: ${JSON.stringify(res.details, null, 2)}` : '';
                const fullError = `${errorMsg}${statusInfo}${detailsInfo}`;
                console.error('Error en checkout:', res);
                setError(fullError);
              }
            }}
          >
            {loading ? 'Procesando...' : 'Proceder al Pago'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;

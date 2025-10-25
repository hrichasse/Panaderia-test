function Cart({ cart, isOpen, onClose, onUpdateQuantity, onCheckout }) {
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
          <button className="checkout-btn" id="checkoutBtn" onClick={onCheckout}>
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;

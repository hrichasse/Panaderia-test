import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const CartContext = createContext(null);

// Hook personalizado para usar el contexto del carrito
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

// Clave para localStorage
const CART_STORAGE_KEY = 'pasteleria_mil_sabores_cart';

// Validar estructura del carrito
const validateCartItem = (item) => {
  if (!item || typeof item !== 'object') return null;
  if (!item.id || !item.name || !item.price) return null;
  if (typeof item.quantity !== 'number' || item.quantity < 1) return null;
  return {
    id: item.id,
    name: item.name,
    price: item.price,
    description: item.description || '',
    image: item.image || '',
    category: item.category || '',
    quantity: Math.max(1, Math.floor(item.quantity))
  };
};

export function CartProvider({ children }) {
  // Estado del carrito con carga inicial desde localStorage
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      
      // Validar cada item del carrito
      const validated = parsed.map(validateCartItem).filter(Boolean);
      return validated;
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);

  // Persistir carrito en localStorage cada vez que cambie
  useEffect(() => {
    try {
      if (cart.length === 0) {
        localStorage.removeItem(CART_STORAGE_KEY);
      } else {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      }
    } catch (error) {
      console.error('Error al guardar carrito:', error);
    }
  }, [cart]);

  // Agregar producto al carrito
  const addToCart = useCallback((product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Incrementar cantidad si ya existe
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Agregar nuevo item
        const newItem = validateCartItem({ ...product, quantity: 1 });
        return newItem ? [...prevCart, newItem] : prevCart;
      }
    });
    setCartOpen(true);
  }, []);

  // Remover producto del carrito
  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  // Actualizar cantidad (incrementar/decrementar)
  const updateQuantity = useCallback((productId, change) => {
    setCart(prevCart => {
      const item = prevCart.find(item => item.id === productId);
      if (!item) return prevCart;

      const newQuantity = item.quantity + change;
      
      if (newQuantity <= 0) {
        // Eliminar si la cantidad es 0 o negativa
        return prevCart.filter(item => item.id !== productId);
      } else {
        // Actualizar cantidad
        return prevCart.map(item => 
          item.id === productId 
            ? { ...item, quantity: newQuantity } 
            : item
        );
      }
    });
  }, []);

  // Limpiar todo el carrito
  const clearCart = useCallback(() => {
    setCart([]);
    setCartOpen(false);
  }, []);

  // Calcular total del carrito
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Cantidad total de items (suma de todas las cantidades)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout (procesar pedido)
  const checkout = useCallback(() => {
    if (cart.length === 0) {
      return { success: false, message: 'Tu carrito está vacío' };
    }
    
    const total = cartTotal;
    clearCart();
    
    return { 
      success: true, 
      message: `Pedido procesado por $${total.toLocaleString()} CLP. ¡Gracias por tu compra!` 
    };
  }, [cart.length, cartTotal, clearCart]);

  const value = {
    cart,
    cartOpen,
    setCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    cartTotal,
    cartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

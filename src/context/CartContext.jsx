import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from '../utils/axios';
import { ORDER_STATUSES, PAYMENT_METHODS } from './orders.constants';

// Backend contract reference:
// 1) Auth: Requires JWT token in `Authorization: Bearer <token>`
// 2) POST /api/orders expects body:
//    {
//      items: [{ productId, quantity }],
//      paymentMethod: "efectivo" | "tarjeta" | "transferencia",
//      deliveryAddress: { street, number, city, notes? },
//      notes?: string
//    }
//    Do NOT send: name, price, total, userId, status
// 3) Response shape: response.data.data.order
//    Includes: full order with server-calculated total, populated user, current prices

// See constants in './orders.constants'

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

  // Checkout (procesar pedido y crear orden en backend)
  // Params: { paymentMethod, deliveryAddress: { street, number, city, notes? }, notes? }
  const checkout = useCallback(async ({ paymentMethod, deliveryAddress, notes } = {}) => {
    if (cart.length === 0) {
      return { success: false, message: 'Tu carrito está vacío' };
    }

    try {
      // Validaciones básicas antes de llamar al backend
      if (!paymentMethod || !PAYMENT_METHODS.includes(paymentMethod)) {
        return { success: false, message: 'Método de pago inválido' };
      }
      if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city) {
        return { success: false, message: 'Dirección de entrega incompleta' };
      }

      // Mapear items al formato exacto esperado por el backend
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const payload = {
        items,
        paymentMethod,
        deliveryAddress,
        ...(notes ? { notes } : {}),
      };

      console.log('Enviando orden al backend:', payload);

      const response = await axios.post('/orders', payload);
      
      console.log('Respuesta del backend:', response.data);
      
      const order = response.data?.data?.order || response.data?.order || response.data;

      // Limpiar carrito tras crear orden
      clearCart();

      return {
        success: true,
        order,
        message: 'Orden creada correctamente',
      };
    } catch (err) {
      console.error('Error completo en checkout:', err);
      console.error('Response data:', err.response?.data);
      console.error('Status:', err.response?.status);
      
      const message = err.response?.data?.message || 'Error al crear la orden';
      const details = err.response?.data?.details;
      return {
        success: false,
        message,
        ...(details ? { details } : {}),
        statusCode: err.response?.status,
      };
    }
  }, [cart, clearCart]);

  // Listar órdenes (GET /api/orders) para el usuario autenticado
  const listOrders = useCallback(async () => {
    try {
      console.log('[listOrders] solicitando GET /orders');
      const { data } = await axios.get('/orders');
      try {
        console.log('[listOrders] respuesta cruda JSON:', JSON.stringify(data, null, 2));
      } catch {
        console.log('[listOrders] no se pudo stringify la respuesta');
      }
      // Backend returns pagination envelope: { message, statusCode, data: { items: [...], page, limit, total, totalPages } }
      const orders = data?.data?.items || data?.items || data?.data?.orders || data?.orders || [];
      console.log('[listOrders] orders parseadas:', orders);
      return { success: true, orders };
    } catch (err) {
      console.error('[listOrders] error:', err);
      console.error('[listOrders] error response data:', err.response?.data);
      const message = err.response?.data?.message || 'Error al listar órdenes';
      return { success: false, message, statusCode: err.response?.status };
    }
  }, []);

  const value = {
    cart,
    cartOpen,
    setCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    listOrders,
    cartTotal,
    cartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

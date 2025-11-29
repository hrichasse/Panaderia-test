import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Orders() {
  const { listOrders } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await listOrders();
      if (!mounted) return;
      if (res.success) {
        setOrders(res.orders || []);
        setError('');
      } else {
        setError(res.message || 'No se pudieron cargar las órdenes');
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [listOrders]);

  if (loading) return <div style={{ padding: 16 }}>Cargando órdenes...</div>;
  if (error) return <div style={{ padding: 16, color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Mis Órdenes</h2>
      {orders.length === 0 ? (
        <p>No tienes órdenes aún.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {orders.map((order) => (
            <li key={order._id} style={{ border: '1px solid #ddd', marginBottom: 12, padding: 12 }}>
              <div><strong>Número:</strong> {order.orderNumber || order._id}</div>
              <div><strong>Estado:</strong> {order.status}</div>
              <div><strong>Total:</strong> ${order.total?.toLocaleString() || 0}</div>
              <div><strong>Método de pago:</strong> {order.paymentMethod}</div>
              <div><strong>Dirección:</strong> {order.deliveryAddress?.street} {order.deliveryAddress?.number}, {order.deliveryAddress?.city}</div>
              <div><strong>Items:</strong></div>
              <ul>
                {order.items?.map((it) => (
                  <li key={it.productId}>
                    {it.product?.name || it.productId} x {it.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

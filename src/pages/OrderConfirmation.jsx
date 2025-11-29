import { useLocation, Link } from 'react-router-dom';

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div style={{ padding: 16 }}>
        <p>No hay información de orden para mostrar.</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>¡Gracias por tu compra!</h2>
      <div><strong>Número:</strong> {order.orderNumber || order._id}</div>
      <div><strong>Estado:</strong> {order.status}</div>
      <div><strong>Total:</strong> {order.total}</div>
      <div><strong>Método de pago:</strong> {order.paymentMethod}</div>
      <div><strong>Dirección:</strong> {order.deliveryAddress?.street} {order.deliveryAddress?.number}, {order.deliveryAddress?.city}</div>
      <h3>Items</h3>
      <ul>
        {order.items?.map((it) => (
          <li key={it.productId}>
            {it.product?.name || it.productId} x {it.quantity}
          </li>
        ))}
      </ul>
      <Link to="/orders">Ver mis órdenes</Link>
    </div>
  );
}

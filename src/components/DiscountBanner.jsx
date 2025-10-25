function DiscountBanner() {
  return (
    <div className="container">
      <div className="discount-banner">
        <h3><i className="fas fa-gift"></i> ¡Ofertas Especiales!</h3>
        <p>50% de descuento para clientes mayores de 50 años</p>
        <p>10% de descuento de por vida con el código: <span className="discount-code">FELICES50</span></p>
        <p>Tortas GRATIS para estudiantes de Duoc en su cumpleaños (con correo institucional)</p>
      </div>
    </div>
  );
}

export default DiscountBanner;

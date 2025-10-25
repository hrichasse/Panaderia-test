function Footer() {
  return (
    <footer id="contacto">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Pastelería Mil Sabores</h3>
            <p>Más de 50 años endulzando momentos especiales.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#categorias">Categorías</a></li>
              <li><a href="#productos">Productos</a></li>
              <li><a href="#nosotros">Nosotros</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contacto</h3>
            <ul>
              <li><i className="fas fa-map-marker-alt"></i> Santiago, Chile</li>
              <li><i className="fas fa-phone"></i> +56 9 1234 5678</li>
              <li><i className="fas fa-envelope"></i> info@pasteleriamilsabores.cl</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Pastelería Mil Sabores. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

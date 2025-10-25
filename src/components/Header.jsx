function Header({ cartCount, onCartClick }) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header>
      <nav className="container">
        <div className="logo">Pastelería Mil Sabores</div>
        <ul className="nav-links">
          <li><a onClick={() => scrollToSection('inicio')}>Inicio</a></li>
          <li><a onClick={() => scrollToSection('categorias')}>Categorías</a></li>
          <li><a onClick={() => scrollToSection('productos')}>Productos</a></li>
          <li><a onClick={() => scrollToSection('nosotros')}>Nosotros</a></li>
          <li><a onClick={() => scrollToSection('contacto')}>Contacto</a></li>
          <li className="cart-icon" onClick={onCartClick}>
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{cartCount}</span>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

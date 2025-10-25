function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="hero" id="inicio">
      <div className="hero-image">
        <img 
          src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e81fd8eb-6639-4954-b661-a3244bb7bce2.png" 
          alt="Elegant bakery interior with warm lighting, display cases full of colorful decorated cakes and pastries"
        />
      </div>
      <div className="container">
        <div className="hero-content">
          <h1>Bienvenidos a Mil Sabores</h1>
          <p>Tradición, calidad y sabores únicos que endulzan tu vida. Más de 50 años creando momentos especiales con nuestras delicias artesanales.</p>
          <button className="cta-button" onClick={() => scrollToSection('productos')}>
            Explorar Productos
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;

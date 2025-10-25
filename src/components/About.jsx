import aboutImage from '../assets/pasteles/about-image.jpg';

function About() {
  return (
    <div className="about" id="nosotros">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>Nuestra Historia</h2>
            <p><strong>Misión:</strong> Ofrecer una experiencia dulce y memorable, con productos de repostería de alta calidad para todas las ocasiones, celebrando las raíces históricas y fomentando la creatividad en la repostería.</p>
            <br />
            <p><strong>Visión:</strong> Ser la tienda online líder de productos de repostería en Chile, reconocida por innovación, calidad y el impacto positivo en la comunidad, especialmente en la formación de nuevos talentos en gastronomía.</p>
            <br />
            <p>Desde hace más de medio siglo, Pastelería Mil Sabores ha sido sinónimo de tradición y excelencia en el mundo de la repostería. Nuestras recetas ancestrales se combinan con técnicas modernas para crear productos únicos que deleitan a toda la familia.</p>
          </div>
          <div className="about-image">
            <img src={aboutImage} alt="Pastelería Mil Sabores" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

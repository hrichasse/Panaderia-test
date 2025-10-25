function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote: "Las tortas de Mil Sabores son simplemente espectaculares. Pedimos una para el cumpleaños de mi hija y todos quedaron encantados. ¡Volveremos seguro!",
      author: "María González"
    },
    {
      id: 2,
      quote: "Excelente calidad y servicio. Las opciones sin azúcar son deliciosas y perfectas para quienes cuidamos nuestra salud sin renunciar al sabor.",
      author: "Carlos Ramírez"
    },
    {
      id: 3,
      quote: "Como vegana, es difícil encontrar postres que realmente sean sabrosos. Mil Sabores superó todas mis expectativas. ¡Altamente recomendado!",
      author: "Sofía Martínez"
    }
  ];

  return (
    <div className="testimonials">
      <div className="container">
        <h2 className="section-title">Lo Que Dicen Nuestros Clientes</h2>
        <div className="testimonial-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card fade-in">
              <blockquote>"{testimonial.quote}"</blockquote>
              <p className="testimonial-author">— {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonials;

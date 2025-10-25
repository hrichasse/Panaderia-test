function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote: "Rica! probé la torta de mil hojas con manjar y casi lloro… es como comer un pedacito de infancia. Si pudiera, me llevaría media pastelería a la casa. Muy recomendados, además atienden con pura buena onda.",
      author: "Juan Carlos Navarrete."
    },
    {
      id: 2,
      quote: "Fui de pasada por curiosidad y terminé llevándome una torta entera de maracuyá. ¡Qué explosión de sabor, compadre! Se nota que lo hacen con cariño, nada de industrial. Ahora cada vez que tengo cumpleaños en la familia, ya sabemos dónde ir.",
      author: "Humberto Suazo Gol."
    },
    {
      id: 3,
      quote: "Soy vegana y cuesta encontrar pastelerías con opciones ricas de verdad… pero acá quedé loca. El queque de zanahoria vegano estaba húmedo, sabroso y con un glaseado que ni se nota que no lleva lácteos. ¡Por fin un lugar donde puedo comer tranquila y disfrutar sin culpa!.",
      author: "Lana Rhoades."
    },
    {
      id: 4,
      quote: "Hermano, los berlines rellenos de crema son otro nivel. Crujientes por fuera, suaves por dentro… y el café que tienen acompaña perfecto. Si andan cerca, no se lo pierdan, porque de verdad que vale la pena.",
      author: "Daniel Carrasco."
    },
    {
      id: 5,
      quote: "Pasé a comprar un kuchen de frambuesa para la once y uff… ¡qué manera de desaparecer rápido en la mesa! Hasta mi abuela, que es exigente con los dulces, pidió repetición. Ya me ganaron como cliente fijo.",
      author: "Daniela Fuentes."
    },
    {
      id: 6,
      quote: "Encargamos una torta personalizada para el cumple de mi hijo y quedó preciosa, además de riquísima. Se pasaron con la decoración, todos quedaron impresionados.",
      author: "Antonio Vivar."
    }
  ];

  return (
    <div className="testimonials" id="testimonios">
      <div className="container">
        <h2 className="section-title">Lo que dicen nuestros clientes</h2>
        <div className="testimonial-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <p>"{testimonial.quote}"</p>
              <p className="author">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonials;

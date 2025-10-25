function FAQ() {
  const faqs = [
    {
      question: "¿Cuáles son los métodos de pago aceptados?",
      answer: "Aceptamos tarjetas de crédito (Visa, Mastercard, American Express), PayPal y transferencias bancarias."
    },
    {
      question: "¿Realizan envíos a todo Chile?",
      answer: "Sí, realizamos envíos a todas las regiones de Chile. Los tiempos y costos de envío varían según la ubicación."
    },
    {
      question: "¿Puedo personalizar mi torta?",
      answer: "¡Claro! Ofrecemos opciones de personalización para la mayoría de nuestras tortas. Contáctanos con tus ideas."
    },
    {
      question: "¿Cómo puedo aplicar los descuentos?",
      answer: "Los descuentos se aplican automáticamente al registrarte si cumples con los requisitos de edad, o puedes ingresar el código \"FELICES50\" en el carrito."
    },
    {
      question: "¿Los productos sin gluten y veganos son aptos para alérgicos severos?",
      answer: "Se elaboran con precauciones pero en la misma cocina se manipulan alérgenos. Para alergias severas, recomendamos precaución."
    }
  ];

  return (
    <div className="faq" id="faq">
      <div className="container">
        <h2 className="section-title">Preguntas Frecuentes</h2>
        
        {faqs.map((faq, index) => (
          <details key={index} className="faq-item">
            <summary className="faq-question">{faq.question}</summary>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default FAQ;

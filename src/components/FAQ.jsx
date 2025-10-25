function FAQ() {
  const faqs = [
    "¿Hacen entregas a domicilio?",
    "¿Puedo personalizar mi torta?",
    "¿Cuál es el tiempo de anticipación para un pedido?",
    "¿Tienen opciones para personas con alergias alimentarias?",
    "¿Ofrecen descuentos para pedidos grandes?",
    "¿Cómo puedo pagar mi pedido?",
    "¿Tienen tienda física?",
    "¿Qué medidas de seguridad alimentaria siguen?"
  ];

  return (
    <div className="faq" id="faq">
      <div className="container">
        <h2 className="section-title">Preguntas Frecuentes</h2>
        <ul className="faq-list">
          {faqs.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FAQ;

function Categories() {
  const categories = [
    { id: 'tortas-cuadradas', name: 'Tortas Cuadradas', description: 'Perfectas para celebraciones', image: 'tortas-cuadradas.jpg' },
    { id: 'tortas-circulares', name: 'Tortas Circulares', description: 'Clásicas y deliciosas', image: 'tortas-circulares.jpg' },
    { id: 'postres-individuales', name: 'Postres Individuales', description: 'Porciones perfectas', image: 'postres-individuales.jpg' },
    { id: 'sin-azucar', name: 'Productos Sin Azúcar', description: 'Saludables y sabrosos', image: 'sin-azucar.jpg' },
    { id: 'tradicional', name: 'Pastelería Tradicional', description: 'Recetas ancestrales', image: 'tradicional.jpg' },
    { id: 'sin-gluten', name: 'Sin Gluten', description: 'Delicias para todos', image: 'sin-gluten.jpg' },
    { id: 'vegana', name: 'Vegana', description: 'Opciones saludables', image: 'vegana.jpg' },
    { id: 'especiales', name: 'Especiales', description: 'Creaciones únicas', image: 'especiales.jpg' }
  ];

  const handleCategoryClick = (categoryId) => {
    // Scroll to products section
    const productsSection = document.getElementById('productos');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Trigger filter (will be handled by Products component)
    setTimeout(() => {
      const filterBtn = document.querySelector(`[data-category="${categoryId}"]`);
      if (filterBtn) {
        filterBtn.click();
      }
    }, 500);
  };

  const getImagePath = (imageName) => {
    try {
      return new URL(`../assets/pasteles/${imageName}`, import.meta.url).href;
    } catch (e) {
      console.error(`Error loading image: ${imageName}`, e);
      return '';
    }
  };

  return (
    <div className="categories" id="categorias">
      <div className="container">
        <h2 className="section-title">Nuestras Categorías</h2>
        <div className="category-grid">
          {categories.map(category => (
            <div 
              key={category.id} 
              className="category-card" 
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="category-image">
                <img src={getImagePath(category.image)} alt={category.name} />
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;

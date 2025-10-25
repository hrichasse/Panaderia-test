import { useState } from 'react';
import { products } from '../data/products';

// Carga todas las imágenes de la carpeta pasteles de forma eager para poder resolver dinámicamente
const images = import.meta.glob('../assets/pasteles/*', { eager: true, as: 'url' });

function resolveProductImage(product) {
  const candidates = [];
  if (product?.image) candidates.push(product.image.toLowerCase());
  if (product?.category) candidates.push(`${product.category.toLowerCase()}.jpg`);

  // Busca por coincidencia exacta de nombre de archivo al final de la ruta
  for (const name of candidates) {
    const match = Object.entries(images).find(([path]) => path.toLowerCase().endsWith(`/${name}`));
    if (match) return match[1];
  }

  // Último recurso: placeholder transparente (1x1)
  return 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
}

function Products({ onAddToCart }) {
  const [currentFilter, setCurrentFilter] = useState('todos');
  const [showingAll, setShowingAll] = useState(false);
  const productsPerPage = 8;

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'tortas-cuadradas', label: 'Tortas Cuadradas' },
    { id: 'tortas-circulares', label: 'Tortas Circulares' },
    { id: 'postres-individuales', label: 'Postres Individuales' },
    { id: 'sin-azucar', label: 'Sin Azúcar' },
    { id: 'tradicional', label: 'Tradicional' },
    { id: 'sin-gluten', label: 'Sin Gluten' },
    { id: 'vegana', label: 'Vegana' },
    { id: 'especiales', label: 'Especiales' }
  ];

  const filterProducts = (category) => {
    setCurrentFilter(category);
    setShowingAll(false);
    
    // Update active button
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === category);
    });
  };

  const toggleShowAll = () => {
    if (!showingAll) {
      // When expanding, show all categories
      setCurrentFilter('todos');
    }
    setShowingAll(!showingAll);

    // Scroll to grid start when collapsing
    if (showingAll) {
      const grid = document.getElementById('productGrid');
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };


  // Filter products based on current filter
  const filteredProducts = currentFilter === 'todos' 
    ? products 
    : products.filter(product => product.category === currentFilter);

  // Determine which products to display
  const displayedProducts = showingAll 
    ? products 
    : filteredProducts.slice(0, productsPerPage);

  // Show button if there are more than 8 total products
  const showLoadMoreBtn = products.length > productsPerPage;

  return (
    <div className="products" id="productos">
      <div className="container">
        <h2 className="section-title">Nuestros Productos</h2>
        
        <div className="filter-buttons">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`filter-btn ${currentFilter === filter.id ? 'active' : ''}`}
              data-category={filter.id}
              onClick={() => filterProducts(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="product-grid" id="productGrid">
          {displayedProducts.map(product => (
            <div key={product.id} className="product-card fade-in">
              <div className="product-image">
                <img src={resolveProductImage(product)} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price.toLocaleString()}</p>
                <button className="add-to-cart" onClick={() => onAddToCart(product)}>
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        {showLoadMoreBtn && (
          <div className="load-more-container">
            <button 
              id="loadMoreBtn" 
              type="button" 
              className="cta-button"
              onClick={toggleShowAll}
            >
              {showingAll ? 'Mostrar menos' : 'Ver todos los productos'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;

import React from 'react';
import { CategoryCard } from './CategoryCard';
import { resolverImagenPorNombre } from '../utils/imageResolver';

// Alineado con las pestañas: Tortas, Individuales, Veganos, Sin Azúcar
// Coloca imágenes: tortas.jpg, individuales.jpg, veganos.jpg, sin-azucar.jpg
const CATEGORIAS = [
  { title: 'Tortas', description: 'Clásicas, rellenas y para celebrar' },
  { title: 'Individuales', description: 'Porciones listas para disfrutar' },
  { title: 'Veganos', description: 'Sabores sin ingredientes de origen animal' },
  { title: 'Sin Azúcar', description: 'Opciones saludables y deliciosas' },
];

export default function Catalogo() {
  return (
    <section className="catalogo">
      <header className="header">
        <h1>Catálogo</h1>
        <p>Coloca tus imágenes en <code>src/assets/pasteles</code> con el mismo nombre de cada categoría.</p>
      </header>
      <div className="grid">
        {CATEGORIAS.map((cat) => (
          <CategoryCard
            key={cat.title}
            title={cat.title}
            description={cat.description}
            imageUrl={resolverImagenPorNombre(cat.title)}
          />
        ))}
      </div>
    </section>
  );
}

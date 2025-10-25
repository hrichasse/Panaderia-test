import React from 'react';

export function CategoryCard({ title, description, imageUrl, badge }) {
  return (
    <article className="card-categoria">
      <div className="card-media">
        {imageUrl ? (
          <img src={imageUrl} alt={title} loading="lazy" />
        ) : (
          <img src="/vite.svg" alt="placeholder" style={{opacity:.2, objectFit:'contain'}} />
        )}
        {badge && <span className="badge">{badge}</span>}
      </div>
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        {description && <p className="card-desc">{description}</p>}
      </div>
    </article>
  );
}

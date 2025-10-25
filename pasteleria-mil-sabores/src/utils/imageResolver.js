// Utilidad para resolver imágenes por nombre usando Vite import.meta.glob
// Coloca tus imágenes en src/assets/pasteles con nombres como:
//  - tortas-cuadradas.jpg
//  - tortas-circulares.webp
//  - postres-individuales.png
//  - productos-sin-azucar.jpeg
// Se aceptan extensiones: jpg, jpeg, png, webp, avif

const normalizar = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Carga todas las imágenes disponibles en la carpeta pasteles
// Vite 5/7: usa query "?url" en lugar de `as: 'url'`
const imagenes = import.meta.glob(
  '../assets/pasteles/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, query: '?url', import: 'default' }
);

// Construye un índice por nombre base normalizado
const indice = Object.entries(imagenes).reduce((acc, [ruta, url]) => {
  const base = ruta.split('/').pop() || '';
  const nombre = base.replace(/\.[^.]+$/, '');
  const clave = normalizar(nombre);
  if (!acc[clave]) acc[clave] = url;
  return acc;
}, /** @type {Record<string,string>} */ ({}));

export function resolverImagenPorNombre(nombre) {
  const clave = normalizar(nombre);
  return indice[clave]; // puede ser undefined si no existe
}

export function getIndiceImagenes() {
  return { ...indice };
}

// Alias semántico cuando la imagen se nombra por categoría
export function resolverImagenPorCategoria(nombreCategoria) {
  return resolverImagenPorNombre(nombreCategoria);
}

# Pastelería Mil Sabores

Catálogo de categorías con imágenes reconocidas automáticamente por nombre usando Vite + React.

## Agregar tus fotos

1. Crea (si no existe) la carpeta `src/assets/pasteles/`.
2. Copia las imágenes de tus productos ahí y nómbralas según la categoría. Ejemplos:

```
src/assets/pasteles/
	tortas-cuadradas.jpg
	tortas-circulares.webp
	postres-individuales.png
	productos-sin-azucar.jpeg
```

Se aceptan extensiones: `jpg`, `jpeg`, `png`, `webp`, `avif`.

La app buscará el archivo cuyo nombre coincida con el título de la tarjeta y lo mostrará automáticamente.

## Scripts

- `npm run dev` — modo desarrollo
- `npm run build` — compilar para producción
- `npm run preview` — previsualizar la compilación

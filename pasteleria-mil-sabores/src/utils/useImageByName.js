import { useMemo } from 'react';
import { resolverImagenPorNombre } from './imageResolver';

export function useImageByName(name) {
  return useMemo(() => resolverImagenPorNombre(name), [name]);
}

export function useImageByCategory(categoryName) {
  return useMemo(() => resolverImagenPorNombre(categoryName), [categoryName]);
}

import { obtenerJSON } from './cliente';
import { leerCache, precargar } from './cache';
import { useConsulta } from '../hooks/useConsulta';

// Endpoints de la librería y sus claves de caché.
// Las páginas no conocen URLs: usan estos hooks.

const TTL_CATEGORIAS = 5 * 60_000; // cambian poco: 5 minutos

export const claves = {
  categorias: () => 'categorias',
  librosDe: (slug) => `categorias/${slug}/libros`,
  libro: (id) => `libros/${id}`,
};

export const api = {
  categorias: () => obtenerJSON('/categorias'),
  librosDe: (slug) => obtenerJSON(`/categorias/${encodeURIComponent(slug)}/libros`),
  libro: (id) => obtenerJSON(`/libros/${encodeURIComponent(id)}`),
};

export const useCategorias = () => useConsulta(claves.categorias(), api.categorias, { ttl: TTL_CATEGORIAS });

export const useLibrosDeCategoria = (slug) => useConsulta(claves.librosDe(slug), () => api.librosDe(slug));

// El detalle se muestra al instante si el libro ya vino en el listado de su
// categoría (datos parciales); mientras tanto llega la versión completa.
export const useLibro = (id) => useConsulta(claves.libro(id), () => api.libro(id), { inicial: () => buscarEnListados(id) });

function buscarEnListados(id) {
  const categorias = leerCache(claves.categorias())?.datos ?? [];
  for (const { slug } of categorias) {
    const listado = leerCache(claves.librosDe(slug))?.datos;
    const libro = listado?.libros.find((l) => l.id === id);
    if (libro) return { ...libro, categoria: { slug: listado.categoria.slug, nombre: listado.categoria.nombre } };
  }
  return null;
}

// Precargas: se llaman al pasar el mouse o enfocar un enlace.
export const precargarCategoria = (slug) => precargar(claves.librosDe(slug), () => api.librosDe(slug));
export const precargarLibro = (id) => precargar(claves.libro(id), () => api.libro(id));

import { useEffect } from 'react';

// Título de la pestaña por página (en una SPA no cambia solo al navegar).
export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | Librería Alerce` : 'Librería Alerce';
  }, [titulo]);
}

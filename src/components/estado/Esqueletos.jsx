// Esqueletos: siluetas con la misma forma que el contenido que viene.
// El usuario ve dónde aparecerá cada cosa y la página no "salta" al llegar los datos.

export function EsqueletoCategorias({ cantidad = 6 }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Cargando categorías">
      {Array.from({ length: cantidad }, (_, i) => (
        <li key={i} className="tarjeta space-y-3 p-5">
          <div className="hueso h-6 w-2/3" />
          <div className="hueso h-4 w-full" />
          <div className="hueso h-4 w-4/5" />
          <div className="hueso h-5 w-24" />
        </li>
      ))}
    </ul>
  );
}

export function EsqueletoLibros({ cantidad = 4 }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" aria-busy="true" aria-label="Cargando libros">
      {Array.from({ length: cantidad }, (_, i) => (
        <li key={i} className="tarjeta overflow-hidden">
          <div className="hueso aspect-[3/4] rounded-none" />
          <div className="space-y-2 p-4">
            <div className="hueso h-5 w-4/5" />
            <div className="hueso h-4 w-1/2" />
            <div className="hueso h-5 w-20" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function EsqueletoDetalle() {
  return (
    <div className="grid gap-8 md:grid-cols-[240px_1fr]" aria-busy="true" aria-label="Cargando libro">
      <div className="hueso aspect-[3/4] w-full max-w-[240px]" />
      <div className="space-y-4">
        <div className="hueso h-9 w-3/4" />
        <div className="hueso h-5 w-1/3" />
        <div className="hueso h-4 w-full" />
        <div className="hueso h-4 w-5/6" />
        <div className="hueso h-10 w-40" />
      </div>
    </div>
  );
}

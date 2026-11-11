// Franja sobre el contenido que ya se muestra:
//  - "Actualizando…" cuando llegan datos más nuevos en segundo plano.
//  - Respaldo: la actualización falló, pero se siguen mostrando los últimos
//    datos conocidos (solución alternativa en vez de una pantalla de error).

function hace(ms) {
  const min = Math.round((Date.now() - ms) / 60_000);
  if (min < 1) return 'hace menos de un minuto';
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  return h < 24 ? `hace ${h} h` : `hace ${Math.round(h / 24)} d`;
}

export default function AvisoEstado({ error, actualizando, actualizadoEn, onReintentar }) {
  if (error) {
    return (
      <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ocre-400/40 bg-ocre-100 px-4 py-3 text-sm text-ocre-700">
        <p>
          <strong>No pudimos actualizar:</strong> {error.message}{' '}
          {actualizadoEn ? `Mostramos los datos guardados ${hace(actualizadoEn)}.` : 'Mostramos la información disponible.'}
        </p>
        {error.tipo !== 'no-encontrado' && (
          <button type="button" onClick={onReintentar} className="btn-secundario px-3 py-1.5 text-xs">Reintentar</button>
        )}
      </div>
    );
  }
  if (actualizando) {
    return (
      <p role="status" className="inline-flex items-center gap-2 text-sm text-stone-500">
        <span aria-hidden="true" className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-stone-300 border-t-alerce-600" />
        Actualizando…
      </p>
    );
  }
  return null;
}

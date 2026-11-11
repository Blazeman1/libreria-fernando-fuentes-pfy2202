import { useSyncExternalStore } from 'react';
import { ESCENARIOS, cambiarEscenario, obtenerEscenario, suscribirEscenario } from '../../mocks/simulador';
import { reiniciarCache } from '../../api/cache';
import { useActividadRed } from '../../hooks/useConsulta';

// Panel de demostración: fuerza fallas del backend mock y muestra cuántas
// peticiones se hicieron realmente y cuántas se evitaron con la caché.
export default function PanelSimulador() {
  const escenario = useSyncExternalStore(suscribirEscenario, obtenerEscenario);
  const { peticiones, desdeCache, reutilizadas, enVuelo } = useActividadRed();

  const vaciarYRecargar = () => {
    reiniciarCache();
    window.location.reload();
  };

  return (
    <details className="tarjeta group fixed bottom-4 right-4 z-40 w-[calc(100%-2rem)] max-w-sm open:shadow-xl sm:w-96">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${escenario === 'normal' ? 'bg-alerce-500' : 'bg-ocre-400'}`} />
          Simulador de API · {ESCENARIOS[escenario].nombre}
        </span>
        <span aria-hidden="true" className="text-stone-400 transition-transform group-open:rotate-180">▾</span>
      </summary>

      <div className="space-y-4 border-t border-papel-200 px-4 pb-4 pt-3">
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">Comportamiento del servidor</legend>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(ESCENARIOS).map(([clave, { nombre }]) => (
              <button
                key={clave}
                type="button"
                aria-pressed={escenario === clave}
                onClick={() => cambiarEscenario(clave)}
                className={`rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
                  escenario === clave ? 'border-alerce-600 bg-alerce-600 text-white' : 'border-stone-300 bg-white hover:border-alerce-500'
                }`}
              >
                {nombre}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-stone-500">{ESCENARIOS[escenario].detalle}</p>
        </fieldset>

        <dl className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-papel-100 p-2"><dt className="text-stone-500">Al servidor</dt><dd className="text-lg font-bold tabular-nums">{peticiones}</dd></div>
          <div className="rounded-lg bg-papel-100 p-2"><dt className="text-stone-500">Desde caché</dt><dd className="text-lg font-bold tabular-nums">{desdeCache}</dd></div>
          <div className="rounded-lg bg-papel-100 p-2"><dt className="text-stone-500">Reutilizadas</dt><dd className="text-lg font-bold tabular-nums">{reutilizadas}</dd></div>
        </dl>
        <p className="text-xs text-stone-500">
          {enVuelo > 0 ? `${enVuelo} en curso. ` : ''}"Reutilizadas" son peticiones iguales que se unieron a una que ya estaba en camino.
        </p>
        <button type="button" onClick={vaciarYRecargar} className="btn-secundario w-full py-2 text-xs">Vaciar caché y recargar</button>
      </div>
    </details>
  );
}

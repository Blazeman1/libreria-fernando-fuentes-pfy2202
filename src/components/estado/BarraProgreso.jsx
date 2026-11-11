import { useActividadRed } from '../../hooks/useConsulta';

// Barra superior que aparece mientras haya CUALQUIER petición en curso
// (incluidas las actualizaciones en segundo plano y las precargas) y se
// retira sola cuando todas terminan.
export default function BarraProgreso() {
  const { enVuelo } = useActividadRed();
  const activa = enVuelo > 0;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 overflow-hidden" aria-hidden={!activa}>
      <div className={`h-full transition-opacity duration-300 ${activa ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-full w-2/5 animate-avance rounded-full bg-ocre-400" />
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {activa ? `Cargando datos (${enVuelo} ${enVuelo === 1 ? 'petición' : 'peticiones'} en curso)` : ''}
      </span>
    </div>
  );
}

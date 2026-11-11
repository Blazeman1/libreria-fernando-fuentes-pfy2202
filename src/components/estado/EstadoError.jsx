import { Link } from 'react-router-dom';

// Un mensaje distinto para cada tipo de falla: el usuario entiende QUÉ
// pasó y QUÉ puede hacer, en vez de un genérico "Ocurrió un error".
const MENSAJES = {
  'no-encontrado': {
    icono: '?',
    titulo: 'No encontramos lo que buscas',
    ayuda: 'Puede que el enlace esté mal escrito o que el contenido ya no exista.',
  },
  servidor: {
    icono: '!',
    titulo: 'El servidor tuvo un problema',
    ayuda: 'No es un problema de tu equipo. Suele resolverse en unos segundos.',
  },
  red: {
    icono: '⚡',
    titulo: 'Sin conexión con el servidor',
    ayuda: 'Revisa tu conexión a internet y vuelve a intentarlo.',
  },
  tiempo: {
    icono: '⏱',
    titulo: 'El servidor está tardando demasiado',
    ayuda: 'Puede estar saturado. Vuelve a intentarlo en un momento.',
  },
};
const GENERICO = { icono: '!', titulo: 'Algo salió mal', ayuda: 'Vuelve a intentarlo en un momento.' };

/**
 * error          ApiError recibido de useConsulta
 * onReintentar   acción para volver a consultar (no se ofrece en un 404)
 * children       alternativas extra (por ejemplo, otras categorías)
 */
export default function EstadoError({ error, onReintentar, children }) {
  const { icono, titulo, ayuda } = MENSAJES[error.tipo] ?? GENERICO;
  const tecnico = [
    error.status && `código ${error.status}`,
    error.intentos > 1 && `${error.intentos} intentos`,
  ].filter(Boolean).join(' · ');

  return (
    <section role="alert" className="tarjeta mx-auto max-w-xl space-y-4 p-6 text-center sm:p-8">
      <p aria-hidden="true" className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ocre-100 text-2xl font-bold text-ocre-700">
        {icono}
      </p>
      <h2 className="text-2xl font-bold">{titulo}</h2>
      <p className="text-stone-700">{error.message}</p>
      <p className="text-sm text-stone-500">{ayuda}</p>
      {tecnico && <p className="text-xs text-stone-400">Detalle técnico: {tecnico}</p>}

      <div className="flex flex-wrap justify-center gap-2 pt-2">
        {error.tipo !== 'no-encontrado' && onReintentar && (
          <button type="button" className="btn-primario" onClick={onReintentar}>Reintentar</button>
        )}
        <Link to="/" className="btn-secundario">Ir al inicio</Link>
      </div>
      {children}
    </section>
  );
}

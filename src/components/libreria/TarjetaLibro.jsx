import { Link } from 'react-router-dom';
import { precargarLibro } from '../../api/libreria';
import { clp } from '../../utils/formato';
import Portada from './Portada';

export default function TarjetaLibro({ libro }) {
  // Precarga: al pasar el mouse o enfocar con teclado, el detalle empieza a
  // pedirse antes del clic. Si ya está en caché, no se hace nada.
  const precargar = () => precargarLibro(libro.id);

  return (
    <li>
      <Link
        to={`/libros/${libro.id}`}
        onMouseEnter={precargar}
        onFocus={precargar}
        className="tarjeta group block h-full overflow-hidden transition-shadow hover:shadow-md"
      >
        <Portada libro={libro} />
        <div className="space-y-1 p-3 sm:p-4">
          <h3 className="font-serif text-base font-bold leading-snug group-hover:text-alerce-700 sm:text-lg">{libro.titulo}</h3>
          <p className="text-sm text-stone-600">{libro.autor} · {libro.anio}</p>
          <p className="pt-1 font-semibold tabular-nums">{clp(libro.precio)}</p>
        </div>
      </Link>
    </li>
  );
}

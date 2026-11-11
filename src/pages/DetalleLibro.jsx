import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLibro } from '../api/libreria';
import { useTitulo } from '../hooks/useTitulo';
import { clp } from '../utils/formato';
import AvisoEstado from '../components/estado/AvisoEstado';
import EstadoError from '../components/estado/EstadoError';
import { EsqueletoDetalle } from '../components/estado/Esqueletos';
import Portada from '../components/libreria/Portada';

// DETALLE: GET /api/libros/:id. Si el libro ya vino en el listado de su
// categoría, se muestra al instante y la versión del servidor llega después.
export default function DetalleLibro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { datos: libro, error, cargando, actualizando, actualizadoEn, reintentar } = useLibro(id);
  useTitulo(libro?.titulo ?? (error ? 'Libro no disponible' : 'Cargando…'));

  return (
    <section aria-labelledby="titulo-libro" className="space-y-6">
      <nav aria-label="Ruta" className="flex flex-wrap items-center gap-x-2 text-sm text-stone-500">
        <button type="button" onClick={() => navigate(-1)} className="enlace">← Volver</button>
        <span aria-hidden="true">·</span>
        <Link to="/" className="enlace">Inicio</Link>
        {libro && (
          <>
            <span aria-hidden="true">›</span>
            <Link to={`/categorias/${libro.categoria.slug}`} className="enlace">{libro.categoria.nombre}</Link>
          </>
        )}
      </nav>

      {cargando && <EsqueletoDetalle />}

      {!cargando && error && !libro && (
        <EstadoError error={error} onReintentar={reintentar}>
          {error.tipo === 'no-encontrado' && (
            <p className="pt-2 text-sm text-stone-600">Explora el catálogo desde el <Link to="/" className="enlace">inicio</Link>.</p>
          )}
        </EstadoError>
      )}

      {libro && (
        <>
          <AvisoEstado error={error} actualizando={actualizando} actualizadoEn={actualizadoEn} onReintentar={reintentar} />
          <article className="grid gap-8 md:grid-cols-[240px_1fr]">
            <div className="mx-auto w-full max-w-[240px]">
              <Portada libro={libro} grande />
            </div>
            <div className="space-y-4">
              <div>
                <h1 id="titulo-libro" className="text-3xl font-bold leading-tight sm:text-4xl">{libro.titulo}</h1>
                <p className="mt-1 text-lg text-stone-600">{libro.autor}</p>
              </div>
              <p className="max-w-prose text-stone-700">{libro.descripcion}</p>
              <dl className="grid max-w-md grid-cols-2 gap-3">
                <div className="rounded-lg bg-papel-100 p-3"><dt className="text-sm text-stone-500">Año</dt><dd className="font-semibold">{libro.anio}</dd></div>
                <div className="rounded-lg bg-papel-100 p-3"><dt className="text-sm text-stone-500">Categoría</dt><dd className="font-semibold">{libro.categoria.nombre}</dd></div>
              </dl>
              <p className="text-3xl font-bold tabular-nums">{clp(libro.precio)}</p>
            </div>
          </article>
        </>
      )}
    </section>
  );
}

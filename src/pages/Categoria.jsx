import { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useCategorias, useLibrosDeCategoria } from '../api/libreria';
import { useTitulo } from '../hooks/useTitulo';
import AvisoEstado from '../components/estado/AvisoEstado';
import EstadoError from '../components/estado/EstadoError';
import { EsqueletoLibros } from '../components/estado/Esqueletos';
import TarjetaLibro from '../components/libreria/TarjetaLibro';

const ORDENES = {
  titulo: { texto: 'Título (A-Z)', comparar: (a, b) => a.titulo.localeCompare(b.titulo, 'es') },
  'precio-asc': { texto: 'Precio: menor a mayor', comparar: (a, b) => a.precio - b.precio },
  'precio-desc': { texto: 'Precio: mayor a menor', comparar: (a, b) => b.precio - a.precio },
  anio: { texto: 'Más recientes', comparar: (a, b) => b.anio - a.anio },
};

// Otras categorías como alternativa cuando esta no existe o está vacía.
// Las categorías ya están en caché (las pidió el menú): no se hace otra petición.
function OtrasCategorias({ excluir }) {
  const { datos: categorias } = useCategorias();
  const opciones = (categorias ?? []).filter((c) => c.slug !== excluir && c.totalLibros > 0);
  if (!opciones.length) return null;
  return (
    <div className="space-y-2 pt-2">
      <p className="text-sm font-semibold text-stone-600">Quizás te interese:</p>
      <ul className="flex flex-wrap justify-center gap-2">
        {opciones.map((c) => (
          <li key={c.slug}>
            <Link to={`/categorias/${c.slug}`} className="inline-block rounded-full border border-alerce-100 bg-alerce-50 px-3 py-1 text-sm text-alerce-700 hover:border-alerce-500">
              {c.nombre} ({c.totalLibros})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// CATEGORÍA: libros obtenidos desde GET /api/categorias/:slug/libros.
export default function Categoria() {
  const { slug } = useParams();
  const { datos, error, cargando, actualizando, actualizadoEn, reintentar } = useLibrosDeCategoria(slug);
  useTitulo(datos?.categoria.nombre ?? (error ? 'Categoría no disponible' : 'Cargando…'));

  // Búsqueda y orden se aplican sobre los libros YA recibidos: escribir en
  // el buscador o cambiar el orden no genera ninguna petición al servidor.
  const [params, setParams] = useSearchParams();
  const texto = params.get('q') ?? '';
  const orden = ORDENES[params.get('orden')] ? params.get('orden') : 'titulo';
  const actualizar = (clave, valor) => {
    const siguiente = new URLSearchParams(params);
    if (valor) siguiente.set(clave, valor);
    else siguiente.delete(clave);
    setParams(siguiente, { replace: true });
  };

  const visibles = useMemo(() => {
    if (!datos) return [];
    const q = texto.trim().toLowerCase();
    return datos.libros
      .filter((l) => !q || l.titulo.toLowerCase().includes(q) || l.autor.toLowerCase().includes(q))
      .sort(ORDENES[orden].comparar);
  }, [datos, texto, orden]);

  return (
    <section aria-labelledby="titulo-categoria" className="space-y-6">
      <nav aria-label="Ruta" className="text-sm text-stone-500">
        <Link to="/" className="enlace">Inicio</Link> <span aria-hidden="true">›</span> {datos?.categoria.nombre ?? slug}
      </nav>

      {cargando && (
        <>
          <div className="space-y-2">
            <div className="hueso h-9 w-56" />
            <div className="hueso h-4 w-96 max-w-full" />
          </div>
          <EsqueletoLibros />
        </>
      )}

      {!cargando && error && !datos && (
        <EstadoError error={error} onReintentar={reintentar}>
          {error.tipo === 'no-encontrado' && <OtrasCategorias excluir={slug} />}
        </EstadoError>
      )}

      {datos && (
        <>
          <div className="space-y-2">
            <h1 id="titulo-categoria" className="text-3xl font-bold sm:text-4xl">{datos.categoria.nombre}</h1>
            <p className="text-stone-600">{datos.categoria.descripcion}</p>
          </div>

          <AvisoEstado error={error} actualizando={actualizando} actualizadoEn={actualizadoEn} onReintentar={reintentar} />

          {datos.libros.length === 0 ? (
            <div className="tarjeta mx-auto max-w-xl space-y-3 p-8 text-center">
              <h2 className="text-2xl font-bold">Aún no tenemos libros de {datos.categoria.nombre}</h2>
              <p className="text-stone-600">Estamos preparando esta sección. Mientras tanto, revisa otras categorías.</p>
              <OtrasCategorias excluir={slug} />
            </div>
          ) : (
            <>
              <div role="search" className="grid gap-3 sm:grid-cols-[1fr_220px]">
                <label>
                  <span className="sr-only">Buscar en {datos.categoria.nombre}</span>
                  <input type="search" className="campo" placeholder="Buscar por título o autor" value={texto} onChange={(e) => actualizar('q', e.target.value)} />
                </label>
                <label>
                  <span className="sr-only">Ordenar</span>
                  <select className="campo" value={orden} onChange={(e) => actualizar('orden', e.target.value === 'titulo' ? '' : e.target.value)}>
                    {Object.entries(ORDENES).map(([clave, { texto: t }]) => <option key={clave} value={clave}>{t}</option>)}
                  </select>
                </label>
              </div>

              <p className="text-sm text-stone-500" aria-live="polite">
                {visibles.length} de {datos.libros.length} {datos.libros.length === 1 ? 'libro' : 'libros'}
              </p>

              {visibles.length === 0 ? (
                <p className="tarjeta p-6 text-center text-stone-600">
                  Ningún libro coincide con «{texto}».{' '}
                  <button type="button" className="enlace" onClick={() => actualizar('q', '')}>Limpiar búsqueda</button>
                </p>
              ) : (
                <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                  {visibles.map((l) => <TarjetaLibro key={l.id} libro={l} />)}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}

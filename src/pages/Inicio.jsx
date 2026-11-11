import { useCategorias } from '../api/libreria';
import { useTitulo } from '../hooks/useTitulo';
import AvisoEstado from '../components/estado/AvisoEstado';
import EstadoError from '../components/estado/EstadoError';
import { EsqueletoCategorias } from '../components/estado/Esqueletos';
import TarjetaCategoria from '../components/libreria/TarjetaCategoria';

// INICIO: lista las categorías obtenidas desde GET /api/categorias.
export default function Inicio() {
  useTitulo('Categorías');
  const { datos: categorias, error, cargando, actualizando, actualizadoEn, reintentar } = useCategorias();

  return (
    <section aria-labelledby="titulo-inicio" className="space-y-6">
      <div className="space-y-2">
        <h1 id="titulo-inicio" className="text-3xl font-bold sm:text-4xl">Explora por categoría</h1>
        <p className="max-w-2xl text-stone-600">Elige una categoría para ver sus libros. Al pasar el mouse sobre una, empezamos a cargarla para que se abra al instante.</p>
      </div>

      {/* Los cuatro estados posibles de una petición, cada uno con su pantalla */}
      {cargando && <EsqueletoCategorias />}

      {!cargando && error && !categorias && <EstadoError error={error} onReintentar={reintentar} />}

      {categorias && (
        <>
          <AvisoEstado error={error} actualizando={actualizando} actualizadoEn={actualizadoEn} onReintentar={reintentar} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categorias.map((c) => <TarjetaCategoria key={c.slug} categoria={c} />)}
          </ul>
        </>
      )}
    </section>
  );
}

import { Link } from 'react-router-dom';
import { precargarCategoria } from '../../api/libreria';

export default function TarjetaCategoria({ categoria }) {
  const precargar = () => precargarCategoria(categoria.slug);
  const { totalLibros } = categoria;

  return (
    <li>
      <Link
        to={`/categorias/${categoria.slug}`}
        onMouseEnter={precargar}
        onFocus={precargar}
        className="tarjeta group flex h-full flex-col gap-2 p-5 transition-shadow hover:shadow-md"
      >
        <h3 className="text-xl font-bold group-hover:text-alerce-700">{categoria.nombre}</h3>
        <p className="flex-1 text-sm text-stone-600">{categoria.descripcion}</p>
        <p className={`text-sm font-semibold ${totalLibros ? 'text-alerce-700' : 'text-stone-400'}`}>
          {totalLibros === 0 ? 'Próximamente' : `${totalLibros} ${totalLibros === 1 ? 'libro' : 'libros'} →`}
        </p>
      </Link>
    </li>
  );
}

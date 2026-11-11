import { Link, useLocation } from 'react-router-dom';
import { useTitulo } from '../hooks/useTitulo';

export default function NoEncontrado() {
  useTitulo('Página no encontrada');
  const { pathname } = useLocation();
  return (
    <section className="tarjeta mx-auto max-w-lg space-y-3 p-8 text-center">
      <p aria-hidden="true" className="font-serif text-6xl font-bold text-ocre-400">404</p>
      <h1 className="text-2xl font-bold">Página no encontrada</h1>
      <p className="text-stone-600">La ruta <code className="rounded bg-papel-100 px-1.5 py-0.5 text-sm">{pathname}</code> no existe en la librería.</p>
      <Link to="/" className="btn-primario">Ver las categorías</Link>
    </section>
  );
}

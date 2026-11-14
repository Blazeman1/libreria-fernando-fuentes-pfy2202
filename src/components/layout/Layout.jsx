import { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useCategorias } from '../../api/libreria';
import { MOCK_ACTIVO, estadoMock } from '../../config';
import BarraProgreso from '../estado/BarraProgreso';
import PanelSimulador from '../estado/PanelSimulador';

// El menú de categorías usa el MISMO hook que la página de inicio: gracias
// a la caché y la deduplicación, ambos comparten una sola petición.
function MenuCategorias() {
  const { datos: categorias } = useCategorias();
  if (!categorias) return null; // mientras carga, el menú simplemente no aparece

  return (
    <nav aria-label="Categorías" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-1 whitespace-nowrap py-1">
        {categorias.map((c) => (
          <li key={c.slug}>
            <NavLink
              to={`/categorias/${c.slug}`}
              className={({ isActive }) =>
                `block rounded-full px-3 py-1.5 text-sm transition-colors ${isActive ? 'bg-white font-semibold text-alerce-700' : 'text-alerce-50 hover:bg-alerce-600'}`
              }
            >
              {c.nombre}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  // Al cambiar de ruta: arriba de la página y foco en el contenido nuevo.
  useEffect(() => {
    window.scrollTo(0, 0);
    mainRef.current?.focus();
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <BarraProgreso />
      <a href="#contenido" className="absolute -left-[999px] top-2 z-50 rounded bg-alerce-700 px-4 py-2 text-white focus:left-4">Saltar al contenido</a>

      <header className="bg-alerce-700 text-white">
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-3">
            <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-lg bg-papel-50 font-serif text-xl font-bold text-alerce-700">A</span>
            <span className="leading-tight">
              <strong className="block font-serif text-xl">Librería Alerce</strong>
              <small className="text-alerce-100">Libros para leer sin apuro</small>
            </span>
          </Link>
          <MenuCategorias />
        </div>
      </header>

      {estadoMock.error && (
        <div role="alert" className="border-b border-ocre-400/40 bg-ocre-100 px-4 py-3 text-sm text-ocre-700">
          <p className="mx-auto max-w-6xl">
            <strong>No se pudo iniciar la API simulada.</strong> Este sitio usa un Service Worker para simular el servidor y tu
            navegador no lo permitió (suele ocurrir en ventanas privadas o de incógnito). Ábrelo en una ventana normal para ver el catálogo.
          </p>
        </div>
      )}

      <main id="contenido" ref={mainRef} tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-8 focus:outline-none">
        <Outlet />
      </main>

      <footer className="border-t border-papel-200 px-4 py-6 text-center text-sm text-stone-500">
        © {new Date().getFullYear()} Librería Alerce · Proyecto académico PFY2202 · Datos servidos por una API REST simulada con MSW
      </footer>

      {MOCK_ACTIVO && <PanelSimulador />}
    </div>
  );
}

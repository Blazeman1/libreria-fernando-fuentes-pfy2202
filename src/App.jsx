import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Inicio from './pages/Inicio';
import Categoria from './pages/Categoria';
import DetalleLibro from './pages/DetalleLibro';
import NoEncontrado from './pages/NoEncontrado';

// Rutas del sitio:
//   /                    Inicio: todas las categorías (GET /api/categorias)
//   /categorias/:slug    Libros de una categoría (GET /api/categorias/:slug/libros)
//   /libros/:id          Detalle de un libro (GET /api/libros/:id)
//   *                    404
//
// basename: en GitHub Pages las rutas viven bajo /libreria-fernando-fuentes-pfy2202/.
// Vite entrega ese prefijo en BASE_URL ("/" en desarrollo).
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="categorias" element={<Navigate to="/" replace />} />
          <Route path="categorias/:slug" element={<Categoria />} />
          <Route path="libros/:id" element={<DetalleLibro />} />
          <Route path="*" element={<NoEncontrado />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

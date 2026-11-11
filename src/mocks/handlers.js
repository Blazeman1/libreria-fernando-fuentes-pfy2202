import { delay, http, HttpResponse } from 'msw';
import { CATEGORIAS, LIBROS } from './datos';
import { debeFallarUnaVez, obtenerEscenario } from './simulador';

// API REST simulada (contrato):
//
//   GET /api/categorias               → 200 [{ slug, nombre, descripcion, totalLibros }]
//   GET /api/categorias/:slug/libros  → 200 { categoria, libros: [...] }  ·  404 { mensaje }
//   GET /api/libros/:id               → 200 { ...libro, categoria: { slug, nombre } }  ·  404 { mensaje }
//
// El prefijo "*" hace que las rutas coincidan con cualquier origen:
// el navegador (localhost:5173) y las pruebas en Node (http://localhost).

const LATENCIA = { normal: 700, lento: 3000, intermitente: 700, error500: 500, tiempo: 'infinite', red: 0 };

// Aplica el escenario del simulador antes de responder. Devuelve una
// respuesta de error si el escenario la exige, o undefined para seguir.
async function aplicarEscenario(request) {
  const escenario = obtenerEscenario();
  await delay(LATENCIA[escenario]);

  if (escenario === 'red') return HttpResponse.error(); // fetch rechaza con TypeError
  if (escenario === 'error500') {
    return HttpResponse.json({ mensaje: 'Error interno del servidor.' }, { status: 500 });
  }
  if (escenario === 'intermitente' && debeFallarUnaVez(request.url)) {
    return HttpResponse.json({ mensaje: 'Servicio temporalmente no disponible.' }, { status: 503 });
  }
  return undefined;
}

// En el listado, cada libro no repite su categoría (ya viene en la respuesta).
const sinCategoria = ({ id, titulo, autor, anio, precio, descripcion }) => ({ id, titulo, autor, anio, precio, descripcion });

const resumenCategoria = (c) => ({ ...c, totalLibros: LIBROS.filter((l) => l.categoria === c.slug).length });

export const handlers = [
  http.get('*/api/categorias', async ({ request }) => {
    const falla = await aplicarEscenario(request);
    if (falla) return falla;
    return HttpResponse.json(CATEGORIAS.map(resumenCategoria));
  }),

  http.get('*/api/categorias/:slug/libros', async ({ request, params }) => {
    const falla = await aplicarEscenario(request);
    if (falla) return falla;

    const categoria = CATEGORIAS.find((c) => c.slug === params.slug);
    if (!categoria) {
      return HttpResponse.json({ mensaje: `La categoría «${params.slug}» no existe.` }, { status: 404 });
    }
    const libros = LIBROS.filter((l) => l.categoria === categoria.slug).map(sinCategoria);
    return HttpResponse.json({ categoria: resumenCategoria(categoria), libros });
  }),

  http.get('*/api/libros/:id', async ({ request, params }) => {
    const falla = await aplicarEscenario(request);
    if (falla) return falla;

    const libro = LIBROS.find((l) => l.id === params.id);
    if (!libro) {
      return HttpResponse.json({ mensaje: `No encontramos el libro «${params.id}».` }, { status: 404 });
    }
    const categoria = CATEGORIAS.find((c) => c.slug === libro.categoria);
    return HttpResponse.json({ ...libro, categoria: { slug: categoria.slug, nombre: categoria.nombre } });
  }),
];

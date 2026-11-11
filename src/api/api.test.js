import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { handlers } from '../mocks/handlers';
import { cambiarEscenario } from '../mocks/simulador';
import { ApiError, configurarCliente, obtenerJSON } from './cliente';
import { consultar, obtenerActividad, reiniciarCache } from './cache';
import { api, claves } from './libreria';

// Las pruebas usan los MISMOS handlers que el navegador, con MSW en Node.
const servidor = setupServer(...handlers);
let peticionesAlServidor = 0;

beforeAll(() => {
  configurarCliente({ baseUrl: 'http://localhost/api' });
  servidor.listen({ onUnhandledRequest: 'error' });
  servidor.events.on('request:start', () => {
    peticionesAlServidor++;
  });
});
beforeEach(() => {
  peticionesAlServidor = 0;
  reiniciarCache();
  cambiarEscenario('normal');
});
afterEach(() => servidor.resetHandlers());
afterAll(() => servidor.close());

const capturarError = (promesa) => promesa.then(() => { throw new Error('se esperaba un error'); }, (e) => e);

describe('API REST simulada', () => {
  it('lista las categorías con su cantidad de libros', async () => {
    const categorias = await api.categorias();
    expect(categorias.map((c) => c.slug)).toContain('ciencia-ficcion');
    expect(categorias.find((c) => c.slug === 'ficcion').totalLibros).toBe(4);
    expect(categorias.find((c) => c.slug === 'drama').totalLibros).toBe(0);
  });

  it('devuelve los libros de una categoría y el detalle de un libro', async () => {
    const { categoria, libros } = await api.librosDe('poesia');
    expect(categoria.nombre).toBe('Poesía');
    expect(libros.map((l) => l.autor)).toContain('Gabriela Mistral');

    const libro = await api.libro('dune');
    expect(libro.titulo).toBe('Dune');
    expect(libro.categoria).toEqual({ slug: 'ciencia-ficcion', nombre: 'Ciencia ficción' });
  });

  it('responde 404 con un mensaje claro si la categoría o el libro no existen', async () => {
    const error = await capturarError(api.librosDe('terror'));
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ tipo: 'no-encontrado', status: 404, message: 'La categoría «terror» no existe.' });

    const errorLibro = await capturarError(api.libro('no-existe'));
    expect(errorLibro.tipo).toBe('no-encontrado');
  });
});

describe('manejo de errores', () => {
  it('clasifica un 500 como error del servidor y reintenta 2 veces antes de rendirse', async () => {
    cambiarEscenario('error500');
    const error = await capturarError(consultar(claves.categorias(), api.categorias));
    expect(error).toMatchObject({ tipo: 'servidor', status: 500, intentos: 3 });
    expect(peticionesAlServidor).toBe(3);
  });

  it('en modo intermitente, el reintento automático resuelve la falla', async () => {
    cambiarEscenario('intermitente');
    const categorias = await consultar(claves.categorias(), api.categorias);
    expect(categorias).toHaveLength(7);
    expect(peticionesAlServidor).toBe(2); // 503 + reintento exitoso
  });

  it('distingue una caída de la red', async () => {
    cambiarEscenario('red');
    const error = await capturarError(obtenerJSON('/categorias'));
    expect(error.tipo).toBe('red');
  });

  it('cancela la petición si el servidor no responde a tiempo, sin reintentarla', async () => {
    cambiarEscenario('tiempo');
    const error = await capturarError(obtenerJSON('/categorias', { tiempoMaximoMs: 100 }));
    expect(error.tipo).toBe('tiempo');
    expect(error.reintentable).toBe(false);
  });

  it('no reintenta un 404: seguiría siendo 404', async () => {
    await capturarError(consultar(claves.librosDe('terror'), () => api.librosDe('terror')));
    expect(peticionesAlServidor).toBe(1);
  });
});

describe('optimización de consultas', () => {
  it('dos componentes que piden lo mismo a la vez generan UNA sola petición', async () => {
    const [a, b] = await Promise.all([
      consultar(claves.categorias(), api.categorias),
      consultar(claves.categorias(), api.categorias),
    ]);
    expect(a).toBe(b);
    expect(peticionesAlServidor).toBe(1);
    expect(obtenerActividad().reutilizadas).toBe(1);
  });

  it('con datos frescos en caché no se vuelve a llamar al servidor', async () => {
    await consultar(claves.categorias(), api.categorias);
    await consultar(claves.categorias(), api.categorias);
    expect(peticionesAlServidor).toBe(1);
    expect(obtenerActividad().desdeCache).toBe(1);
  });

  it('forzar (botón Reintentar o Actualizar) sí vuelve a consultar', async () => {
    await consultar(claves.categorias(), api.categorias);
    await consultar(claves.categorias(), api.categorias, { forzar: true });
    expect(peticionesAlServidor).toBe(2);
  });

  it('una caché vencida vuelve a consultar', async () => {
    await consultar(claves.categorias(), api.categorias);
    await consultar(claves.categorias(), api.categorias, { ttl: 0 });
    expect(peticionesAlServidor).toBe(2);
  });
});

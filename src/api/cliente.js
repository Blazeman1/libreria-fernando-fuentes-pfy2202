// CLIENTE HTTP: única puerta de salida hacia la API REST.
// Convierte cada falla posible en un ApiError con un "tipo" que la
// interfaz sabe explicar al usuario.

export const TIEMPO_MAXIMO_MS = 8000;

export class ApiError extends Error {
  /**
   * @param {'no-encontrado'|'servidor'|'red'|'tiempo'|'cliente'|'formato'} tipo
   */
  constructor(tipo, mensaje, { status = null, intentos = 1 } = {}) {
    super(mensaje);
    this.name = 'ApiError';
    this.tipo = tipo;
    this.status = status;
    this.intentos = intentos;
  }

  // Solo vale la pena reintentar fallas transitorias: un 404 seguirá siendo 404.
  // El tiempo agotado no se reintenta: haría esperar otros 8 s sin aviso.
  get reintentable() {
    return this.tipo === 'servidor' || this.tipo === 'red';
  }
}

let urlBase = '/api';

// Permite apuntar el cliente a otro servidor (en las pruebas: http://localhost/api).
export function configurarCliente({ baseUrl }) {
  urlBase = baseUrl;
}

export async function obtenerJSON(ruta, { tiempoMaximoMs = TIEMPO_MAXIMO_MS } = {}) {
  // AbortController + setTimeout: si el servidor no responde a tiempo,
  // la petición se cancela en vez de quedar esperando para siempre.
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), tiempoMaximoMs);

  let respuesta;
  try {
    respuesta = await fetch(`${urlBase}${ruta}`, { signal: control.signal, headers: { Accept: 'application/json' } });
  } catch {
    if (control.signal.aborted) {
      throw new ApiError('tiempo', `El servidor no respondió en ${tiempoMaximoMs / 1000} segundos.`);
    }
    // fetch rechaza (TypeError) cuando no hay red, el servidor está caído o hay un problema de CORS.
    throw new ApiError('red', 'No pudimos conectarnos con el servidor.');
  } finally {
    clearTimeout(temporizador);
  }

  // fetch NO rechaza ante un 404 o un 500: hay que revisar response.ok a mano.
  if (!respuesta.ok) {
    let cuerpo = null;
    try {
      cuerpo = await respuesta.json();
    } catch {
      /* respuesta de error sin JSON */
    }
    const tipo = respuesta.status === 404 ? 'no-encontrado' : respuesta.status >= 500 ? 'servidor' : 'cliente';
    throw new ApiError(tipo, cuerpo?.mensaje ?? `El servidor respondió con el código ${respuesta.status}.`, { status: respuesta.status });
  }

  try {
    return await respuesta.json();
  } catch {
    throw new ApiError('formato', 'La respuesta del servidor no tiene un formato válido.', { status: respuesta.status });
  }
}

// Reintenta fallas transitorias con espera creciente (400 ms, 800 ms...).
export async function conReintentos(tarea, { reintentos = 2, esperaBaseMs = 400 } = {}) {
  for (let intento = 1; ; intento++) {
    try {
      return await tarea();
    } catch (error) {
      if (!(error instanceof ApiError) || !error.reintentable || intento > reintentos) {
        if (error instanceof ApiError) error.intentos = intento;
        throw error;
      }
      await new Promise((r) => setTimeout(r, esperaBaseMs * 2 ** (intento - 1)));
    }
  }
}

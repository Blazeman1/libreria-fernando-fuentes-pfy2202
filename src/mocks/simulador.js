// SIMULADOR DE FALLAS del backend mock.
// Permite forzar desde la interfaz las situaciones que un backend real
// produce de vez en cuando, para demostrar cómo responde el frontend.
// Los handlers de MSW leen este estado en cada petición.

export const ESCENARIOS = {
  normal: { nombre: 'Normal', detalle: 'Respuestas correctas con una latencia de ~0,7 s.' },
  lento: { nombre: 'Servidor lento', detalle: 'Cada respuesta tarda 3 s.' },
  intermitente: { nombre: 'Intermitente', detalle: 'El primer intento de cada petición falla con 503; el reintento automático lo resuelve.' },
  error500: { nombre: 'Error 500', detalle: 'El servidor responde siempre con un error interno.' },
  tiempo: { nombre: 'Sin respuesta', detalle: 'El servidor no responde: la petición se cancela al superar el tiempo máximo.' },
  red: { nombre: 'Sin conexión', detalle: 'La red falla antes de llegar al servidor.' },
};

const CLAVE = 'libreria-simulador';

let escenario = 'normal';
try {
  const guardado = sessionStorage.getItem(CLAVE);
  if (guardado && ESCENARIOS[guardado]) escenario = guardado;
} catch {
  /* sessionStorage no disponible (pruebas en Node, modo privado) */
}

const suscriptores = new Set();
// Peticiones que ya fallaron una vez en modo intermitente.
const fallaronUnaVez = new Set();

export const obtenerEscenario = () => escenario;

export function cambiarEscenario(nuevo) {
  if (!ESCENARIOS[nuevo]) return;
  escenario = nuevo;
  fallaronUnaVez.clear();
  try {
    sessionStorage.setItem(CLAVE, nuevo);
  } catch {
    /* sin persistencia: el escenario dura hasta recargar */
  }
  suscriptores.forEach((fn) => fn());
}

export function suscribirEscenario(fn) {
  suscriptores.add(fn);
  return () => suscriptores.delete(fn);
}

// Modo intermitente: devuelve true solo la primera vez que se pide una URL.
export function debeFallarUnaVez(url) {
  if (fallaronUnaVez.has(url)) {
    fallaronUnaVez.delete(url);
    return false;
  }
  fallaronUnaVez.add(url);
  return true;
}

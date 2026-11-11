import { conReintentos } from './cliente';

// CACHÉ DE CONSULTAS
// Evita pedir dos veces lo mismo al servidor:
//   1. Datos frescos (dentro del TTL)  → se responden desde memoria, sin red.
//   2. Petición ya en curso            → se reutiliza la misma promesa (deduplicación).
//   3. Datos vencidos                  → se muestran igual y se actualizan en segundo plano.
// Además guarda una copia en localStorage: si el servidor falla, la
// interfaz puede ofrecer los últimos datos conocidos como alternativa.

export const TTL_POR_DEFECTO = 60_000; // 1 minuto
const CLAVE_STORAGE = 'libreria-cache-v1';

const entradas = new Map(); // clave → { datos, actualizadoEn }
const enCurso = new Map(); // clave → Promise

// ---------- Estadísticas de red (para la barra de carga y el panel) ----------
let actividad = { enVuelo: 0, peticiones: 0, desdeCache: 0, reutilizadas: 0 };
const oyentes = new Set();
function actualizarActividad(cambios) {
  actividad = { ...actividad, ...cambios }; // objeto nuevo: useSyncExternalStore detecta el cambio
  oyentes.forEach((fn) => fn());
}
export const obtenerActividad = () => actividad;
export function suscribirActividad(fn) {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
}

// ---------- Persistencia ----------
try {
  const guardado = JSON.parse(localStorage.getItem(CLAVE_STORAGE) ?? '{}');
  Object.entries(guardado).forEach(([clave, entrada]) => entradas.set(clave, entrada));
} catch {
  /* sin localStorage (Node, modo privado) o datos corruptos: caché vacía */
}

function persistir() {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(Object.fromEntries(entradas)));
  } catch {
    /* almacenamiento lleno o bloqueado: la caché sigue en memoria */
  }
}

// ---------- API pública ----------
export const leerCache = (clave) => entradas.get(clave);

export const estaFresca = (clave, ttl = TTL_POR_DEFECTO) => {
  const entrada = entradas.get(clave);
  return Boolean(entrada) && Date.now() - entrada.actualizadoEn < ttl;
};

export const registrarAciertoCache = () => actualizarActividad({ desdeCache: actividad.desdeCache + 1 });

/**
 * Obtiene los datos de "clave". Solo llama a "buscador" (la petición real)
 * si no hay datos frescos y no hay otra petición igual en curso.
 */
export function consultar(clave, buscador, { ttl = TTL_POR_DEFECTO, forzar = false } = {}) {
  if (enCurso.has(clave)) {
    actualizarActividad({ reutilizadas: actividad.reutilizadas + 1 });
    return enCurso.get(clave);
  }
  if (!forzar && estaFresca(clave, ttl)) {
    registrarAciertoCache();
    return Promise.resolve(entradas.get(clave).datos);
  }

  actualizarActividad({ enVuelo: actividad.enVuelo + 1, peticiones: actividad.peticiones + 1 });
  const promesa = conReintentos(buscador)
    .then((datos) => {
      entradas.set(clave, { datos, actualizadoEn: Date.now() });
      persistir();
      return datos;
    })
    .finally(() => {
      enCurso.delete(clave);
      actualizarActividad({ enVuelo: actividad.enVuelo - 1 });
    });

  enCurso.set(clave, promesa);
  return promesa;
}

// Precarga silenciosa (por ejemplo, al pasar el mouse sobre un enlace):
// si falla, no molesta al usuario; la página lo intentará de nuevo al abrirse.
export function precargar(clave, buscador, opciones) {
  consultar(clave, buscador, opciones).catch(() => {});
}

// Solo para pruebas: deja la caché y las estadísticas en cero.
export function reiniciarCache() {
  entradas.clear();
  enCurso.clear();
  actividad = { enVuelo: 0, peticiones: 0, desdeCache: 0, reutilizadas: 0 };
  try {
    localStorage.removeItem(CLAVE_STORAGE);
  } catch {
    /* nada que limpiar */
  }
}

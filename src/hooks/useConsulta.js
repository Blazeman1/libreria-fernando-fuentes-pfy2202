import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { consultar, estaFresca, leerCache, obtenerActividad, registrarAciertoCache, suscribirActividad, TTL_POR_DEFECTO } from '../api/cache';

// Estado inicial de una consulta: si la caché ya tiene datos (frescos o
// vencidos), se muestran de inmediato, sin indicador de carga.
function estadoInicial(clave, obtenerInicial) {
  const entrada = leerCache(clave);
  if (entrada) return { datos: entrada.datos, error: null, cargando: false, actualizando: false, actualizadoEn: entrada.actualizadoEn, parcial: false };
  const inicial = obtenerInicial?.();
  if (inicial) return { datos: inicial, error: null, cargando: false, actualizando: true, actualizadoEn: null, parcial: true };
  return { datos: null, error: null, cargando: true, actualizando: false, actualizadoEn: null, parcial: false };
}

/**
 * Hook para leer datos de la API con caché.
 *   cargando     → no hay nada que mostrar todavía (esqueleto)
 *   actualizando → ya se muestran datos y llegan otros más nuevos
 *   error        → la última petición falló (puede haber datos de respaldo)
 *   reintentar() → fuerza una nueva petición al servidor
 */
export function useConsulta(clave, buscador, { ttl = TTL_POR_DEFECTO, inicial } = {}) {
  // Refs con la última versión de las funciones: el efecto depende solo de
  // la clave, así no se repite la petición por recrear "buscador" en cada render.
  const buscadorRef = useRef(buscador);
  const inicialRef = useRef(inicial);
  useEffect(() => {
    buscadorRef.current = buscador;
    inicialRef.current = inicial;
  });

  const [estado, setEstado] = useState(() => estadoInicial(clave, inicial));
  const [claveMostrada, setClaveMostrada] = useState(clave);
  const [intento, setIntento] = useState(0);

  // Cambió la clave (otra categoría, otro libro): se reinicia el estado
  // durante el render, sin mostrar ni un instante los datos anteriores.
  if (clave !== claveMostrada) {
    setClaveMostrada(clave);
    setEstado(estadoInicial(clave, inicial));
  }

  useEffect(() => {
    if (intento === 0 && estaFresca(clave, ttl)) {
      registrarAciertoCache(); // datos frescos: ninguna petición
      return undefined;
    }

    // "vigente" evita condiciones de carrera: si el usuario cambia de
    // categoría antes de que llegue la respuesta, esa respuesta se ignora.
    let vigente = true;
    setEstado((prev) => ({ ...prev, error: null, cargando: !prev.datos, actualizando: Boolean(prev.datos) }));

    consultar(clave, () => buscadorRef.current(), { ttl, forzar: intento > 0 })
      .then((datos) => {
        if (vigente) setEstado({ datos, error: null, cargando: false, actualizando: false, actualizadoEn: leerCache(clave)?.actualizadoEn ?? Date.now(), parcial: false });
      })
      .catch((error) => {
        if (vigente) setEstado((prev) => ({ ...prev, error, cargando: false, actualizando: false }));
      });

    return () => {
      vigente = false;
    };
  }, [clave, ttl, intento]);

  const reintentar = useCallback(() => setIntento((n) => n + 1), []);

  return { ...estado, reintentar };
}

// Estadísticas globales de red: cuántas peticiones están en curso y
// cuántas se evitaron gracias a la caché.
export function useActividadRed() {
  return useSyncExternalStore(suscribirActividad, obtenerActividad);
}

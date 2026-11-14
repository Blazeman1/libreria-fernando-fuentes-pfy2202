// El backend simulado (MSW) se activa en desarrollo, o al compilar con
// VITE_USAR_MOCK=true (por ejemplo, para publicar una demostración).
export const MOCK_ACTIVO = import.meta.env.DEV || import.meta.env.VITE_USAR_MOCK === 'true';

// Si el Service Worker del mock no pudo iniciarse (por ejemplo, en una ventana
// privada de Firefox, que no permite Service Workers), main.jsx guarda aquí
// el motivo y el Layout lo explica en pantalla.
export const estadoMock = { error: null };

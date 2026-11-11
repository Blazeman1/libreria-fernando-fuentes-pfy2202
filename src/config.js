// El backend simulado (MSW) se activa en desarrollo, o al compilar con
// VITE_USAR_MOCK=true (por ejemplo, para publicar una demostración).
export const MOCK_ACTIVO = import.meta.env.DEV || import.meta.env.VITE_USAR_MOCK === 'true';

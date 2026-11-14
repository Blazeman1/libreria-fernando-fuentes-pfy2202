import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MOCK_ACTIVO, estadoMock } from './config';
import './index.css';

// Activa el backend simulado antes de montar React. Así ninguna petición
// sale antes de que el Service Worker esté listo para interceptarla.
// import() dinámico: el código del mock se descarga solo si se usa.
async function habilitarMock() {
  if (!MOCK_ACTIVO) return;
  const { worker } = await import('./mocks/browser');
  await worker.start({
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    onUnhandledRequest: 'bypass', // archivos del propio sitio: que pasen sin aviso
    quiet: true,
  });
}

// La aplicación se monta SIEMPRE, aunque el mock falle: así el usuario ve
// un aviso con la causa en vez de una página en blanco.
habilitarMock()
  .catch((error) => {
    estadoMock.error = error;
    console.error('No se pudo iniciar la API simulada (MSW):', error);
  })
  .finally(() => {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  });

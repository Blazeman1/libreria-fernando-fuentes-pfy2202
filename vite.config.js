import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En GitHub Pages el sitio vive en https://<usuario>.github.io/<REPO>/
const REPO = 'libreria-fernando-fuentes-pfy2202';

// GitHub Pages no conoce las rutas de React Router: al recargar
// /categorias/poesia busca ese archivo, no lo encuentra y entrega 404.html.
// Copiamos index.html como 404.html para que esa respuesta cargue la app
// y el router muestre la página correcta.
const fallbackSpa = () => ({
  name: 'fallback-spa-github-pages',
  apply: 'build',
  closeBundle() {
    const dist = resolve(import.meta.dirname, 'dist');
    copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
  },
});

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Desarrollo: http://localhost:5173/ · Compilado: /REPO/
  base: command === 'build' ? `/${REPO}/` : '/',
  plugins: [react(), fallbackSpa()],
}));

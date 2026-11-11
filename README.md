# Librería Alerce — Integración frontend + API REST mock

Actividad formativa · **Desarrollo Frontend II (PFY2202)** · Experiencia 2, Semana 4
"Utilizando tecnologías de integración entre frontend y backend" — Forma B (tienda de libros)

**Autor:** Fernando Fuentes Allende — Duoc UC

Tienda de libros en **React** donde los usuarios exploran categorías de libros obtenidas desde una **API REST simulada con MSW (Mock Service Worker)**, con navegación mediante **React Router v6** y estilos con **Tailwind CSS**.

> Nombre del repositorio: las instrucciones indican el formato `hospital-nombre-apellido-siglaCurso`, por lo que se usa `hospital-fernando-fuentes-pfy2202`, aunque el proyecto es una librería.

## Requisitos de la actividad

| Requisito | Implementación |
|---|---|
| Tienda de libros con HTML, JS, CSS y React | Proyecto React (Vite) con Tailwind CSS |
| Explorar categorías de libros | Inicio con las 7 categorías; cada una lista sus libros; cada libro tiene su detalle |
| API REST mock para listar las categorías | MSW intercepta `fetch` en el navegador (`src/mocks/`) y responde como un backend real |
| React Router | `BrowserRouter`, rutas `/`, `/categorias/:slug`, `/libros/:id` y 404 (`src/App.jsx`) |

## Rúbrica y cómo se cumple

| # | Criterio | Implementación |
|---|---|---|
| 1 | **Creación e integración del mock REST** | 3 endpoints con respuestas 200/404 reales y latencia simulada (`src/mocks/handlers.js`). El frontend solo conoce URLs: nunca importa los datos directamente. Los mismos handlers se usan en el navegador (Service Worker) y en las pruebas (Node). |
| 2 | **Manejo de errores con mensajes claros y alternativas** | `src/api/cliente.js` convierte cada falla en un `ApiError` tipado: `no-encontrado` (404), `servidor` (5xx), `red`, `tiempo`. `EstadoError` muestra un título, una explicación y una acción para cada tipo. **Alternativas:** reintento automático en fallas transitorias, botón *Reintentar*, **datos guardados como respaldo** cuando el servidor falla, y **sugerencias de otras categorías** ante un 404 o una categoría vacía. |
| 3 | **Control de carga y estado de las peticiones** | **Esqueletos** con la forma del contenido en cada sección; **barra global** que refleja cada petición en curso, incluidas las de segundo plano, y se retira al terminar; indicador **"Actualizando…"** que no borra lo que ya se ve. Cada consulta distingue `cargando`, `actualizando` y `error`. |
| 4 | **Optimización y eficiencia en las consultas** | `src/api/cache.js`: caché con **TTL** (categorías 5 min, resto 1 min), **deduplicación** de peticiones simultáneas (el menú y la página comparten una sola petición), datos vencidos que se muestran mientras se actualizan, **precarga** al pasar el mouse, detalle instantáneo con los datos del listado, búsqueda y orden **en el cliente** (sin peticiones) y respuestas obsoletas ignoradas al cambiar de ruta. El panel del simulador muestra en vivo cuántas peticiones se hicieron y cuántas se evitaron. |

## Contrato de la API simulada

| Método y ruta | Respuesta exitosa | Errores |
|---|---|---|
| `GET /api/categorias` | `200` `[{ slug, nombre, descripcion, totalLibros }]` | — |
| `GET /api/categorias/:slug/libros` | `200` `{ categoria, libros: [{ id, titulo, autor, anio, precio, descripcion }] }` | `404 { mensaje }` si la categoría no existe |
| `GET /api/libros/:id` | `200` `{ ...libro, categoria: { slug, nombre } }` | `404 { mensaje }` si el libro no existe |

La categoría *Drama* existe pero no tiene libros, para mostrar el estado vacío (igual que en la guía).

## Simulador de fallas (para demostrar los criterios 2 y 3)

Panel flotante en la esquina inferior derecha. Cambia el comportamiento del backend mock sin tocar el código:

| Escenario | Qué hace el servidor | Qué hace la interfaz |
|---|---|---|
| Normal | Responde en ~0,7 s | Esqueletos y luego datos |
| Servidor lento | Responde en 3 s | El esqueleto y la barra acompañan toda la espera |
| Intermitente | El primer intento de cada petición responde 503 | El **reintento automático** lo resuelve; el usuario no ve el error |
| Error 500 | Responde siempre 500 | Tras 3 intentos: "El servidor tuvo un problema", con código, intentos y *Reintentar*. Si hay datos guardados, los muestra con un aviso. |
| Sin respuesta | No responde nunca | A los 8 s cancela (`AbortController`): "El servidor está tardando demasiado" |
| Sin conexión | La red falla | "Sin conexión con el servidor"; si hay datos guardados, los muestra con su antigüedad |

**Demostraciones sugeridas:**
- **Respaldo:** navega con el escenario *Normal*, cambia a *Sin conexión* y entra a una categoría que no hayas visitado (error) o a una ya visitada (datos de la caché).
- **Precarga:** en *Servidor lento*, pasa el mouse sobre una categoría, espera 3 s y haz clic: se abre al instante.
- **Botón "Vaciar caché y recargar":** repite cualquier escenario desde cero.

## Arquitectura

```
Página (Inicio, Categoria, DetalleLibro)
   │  useCategorias() / useLibrosDeCategoria(slug) / useLibro(id)      ← src/api/libreria.js
   ▼
useConsulta(clave, buscador)           estados: cargando · actualizando · error · datos   ← src/hooks/useConsulta.js
   ▼
consultar(clave, ...)                  caché TTL · deduplicación · persistencia · estadísticas   ← src/api/cache.js
   ▼
conReintentos(obtenerJSON(ruta))       timeout 8 s · ApiError tipado · 2 reintentos (400/800 ms)   ← src/api/cliente.js
   ▼
fetch('/api/...')  ──►  Service Worker de MSW  ──►  handlers + simulador   ← src/mocks/
```

## Estructura

```
public/mockServiceWorker.js      # generado por `npx msw init public`
src/
├── main.jsx                     # activa MSW antes de montar React
├── App.jsx                      # rutas
├── config.js                    # MOCK_ACTIVO
├── api/
│   ├── cliente.js               # fetch + ApiError + timeout + reintentos
│   ├── cache.js                 # caché, deduplicación, precarga, estadísticas
│   ├── libreria.js              # endpoints y hooks de la librería
│   └── api.test.js              # 12 pruebas (Vitest + MSW en Node)
├── hooks/
│   ├── useConsulta.js           # hook genérico de consultas + useActividadRed
│   └── useTitulo.js
├── mocks/
│   ├── datos.js                 # categorías y libros (la "base de datos")
│   ├── handlers.js              # endpoints REST simulados
│   ├── simulador.js             # escenarios de falla
│   └── browser.js               # setupWorker
├── components/
│   ├── layout/Layout.jsx        # encabezado, menú de categorías, pie
│   ├── estado/                  # BarraProgreso, Esqueletos, EstadoError, AvisoEstado, PanelSimulador
│   └── libreria/                # TarjetaCategoria, TarjetaLibro, Portada
└── pages/                       # Inicio, Categoria, DetalleLibro, NoEncontrado
```

## Ejecución

Requiere Node.js 18 o superior.

```bash
npm install
npm start          # o npm run dev → http://localhost:5173
npm test           # pruebas de la API simulada (Vitest)
npm run lint
```

> El proyecto usa **Vite** en vez de Create React App (descontinuado). Por eso la condición de la guía `process.env.NODE_ENV === 'development'` se escribe `import.meta.env.DEV`. MSW, `fetch`, `useEffect` y React Router se usan igual que en la guía.
>
> MSW se activa en desarrollo. Para compilar una demostración con el mock incluido: `VITE_USAR_MOCK=true npm run build`.

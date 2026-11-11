// Portada generada con CSS a partir del título: no depende de imágenes
// externas (que serían más peticiones y otro punto de falla).
const TONOS = [
  'from-alerce-700 to-alerce-900',
  'from-ocre-400 to-ocre-700',
  'from-stone-600 to-stone-900',
  'from-rose-700 to-rose-900',
  'from-sky-700 to-sky-900',
  'from-violet-700 to-violet-900',
];

// Mismo libro → mismo color, siempre (función pura del id).
const tonoDe = (id) => TONOS[[...id].reduce((s, c) => s + c.charCodeAt(0), 0) % TONOS.length];

export default function Portada({ libro, grande = false }) {
  return (
    <div
      aria-hidden="true"
      className={`flex aspect-[3/4] w-full flex-col justify-between bg-gradient-to-br p-3 text-white sm:p-4 ${tonoDe(libro.id)} ${grande ? 'rounded-xl p-6 shadow-lg' : ''}`}
    >
      <p className={`font-serif font-bold leading-tight ${grande ? 'text-2xl' : 'text-base sm:text-lg'}`}>{libro.titulo}</p>
      <div>
        <div className="mb-2 h-px w-10 bg-white/50" />
        <p className={`text-white/85 ${grande ? 'text-sm' : 'text-xs'}`}>{libro.autor}</p>
      </div>
    </div>
  );
}

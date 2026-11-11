/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de la librería: verde alerce, papel y un acento ocre.
        alerce: { 50: '#eff6f2', 100: '#d8eadf', 500: '#2f7d5b', 600: '#246449', 700: '#1c4f3a', 900: '#0f2b20' },
        papel: { 50: '#fbf8f3', 100: '#f4eee3', 200: '#e8dfcf' },
        ocre: { 100: '#fbecd3', 400: '#d99a3a', 700: '#8a5a12' },
      },
      fontFamily: {
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        avance: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(250%)' } },
      },
      animation: { avance: 'avance 1.1s ease-in-out infinite' },
    },
  },
  plugins: [],
};

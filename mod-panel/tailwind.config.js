/** @type {import('tailwindcss').Config} */
module.exports = {
  // Wichtig: Dark Mode auf 'class' umstellen, damit next-themes funktioniert
  darkMode: 'class', 
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Übernehme die im Dokument gewünschten Farben
        'futuristic-cyan': '#00BCD4', // Cyan 500
        'futuristic-emerald': '#10B981', // Emerald 500
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  content: [
    './app/**/*.{js,ts,jsx,tsx}', 
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'futuristic-cyan': '#00BCD4', 
        'futuristic-emerald': '#10B981',
      }
    },
  },
  plugins: [],
}

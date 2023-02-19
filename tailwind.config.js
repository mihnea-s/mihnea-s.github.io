/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './scripts/**/*.ts',
    './styles/**/*.css',
  ],

  darkMode: 'class',

  theme: {
    extend: {
      screens: {
        'print': { 'raw': 'print' },
      },
    },
  },

  plugins: [],
}

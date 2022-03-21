module.exports = {
  plugins: [],

  darkMode: 'media',

  purge: [
    './index.html',
    './scripts/**/*.ts',
    './styles/**/*.css',
  ],

  variants: {
    extend: {
      invert: ['dark'],
    },
  },

  theme: {
    extend: {
      zIndex: {
        '-10': '-10',
      },
      screens: {
        'print': { 'raw': 'print' },
      },
    },
  },
};

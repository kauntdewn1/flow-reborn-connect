const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'accent-glitch': '#00ffff', // Ciano vibrante
        'danger-text': '#ff0000',   // Rosa neon
        'primary-text': '#E0E0E0',  // Cinza claro
        'terminal-bg': '#0D0D0D',   // Preto profundo
        'ton-debt': '#ff6b6b',
        'xp-bar': '#00ff00',
      },
      fontFamily: {
        mono: ['"Fira Code"', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 1s infinite',
        'pulse': 'pulse 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-2px, 2px)' },
          '80%': { transform: 'translate(2px, 2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
      boxShadow: {
        'glitch': '0 0 10px #00ffff, 0 0 20px #00ffff',
      },
    },
  },
  plugins: [],
}; 
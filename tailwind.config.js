// ... existing code ...
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terminal-bg': '#0A0A0A',
        'primary-text': '#00FF9F',
        'alert-red': '#FF003C',
        'accent-glitch': '#00FFFF', // Cor de detalhe adicionada
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['Source Code Pro', 'monospace'],
      }
    },
  },
  plugins: [],
}
// ... existing code ...
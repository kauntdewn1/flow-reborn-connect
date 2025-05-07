module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terminal-bg': '#0c0c0c', // Updated from #0A0A0A
        'primary-text': '#00ff9f', // Updated from #00FF9F (normalized case)
        'alert-red': '#FF003C',    // Kept from original
        'accent-glitch': '#ff0059', // Updated from #00FFFF
        'danger-text': '#ff3131',  // Added
        'xp-bar': '#d3ff00',      // Added
        'ton-debt': '#ff8a00',    // Added
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['Source Code Pro', 'monospace'],
      }
    },
  },
  plugins: [],
}
  
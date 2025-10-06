/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'matrix-green': '#00FF41',
        'matrix-dark': '#0D0D0D',
        'matrix-glow': '#39FF14',
        'terminal-amber': '#FFAA00',
        'crt-blue': '#00FFFF',
        'alien-green': '#7FFF00',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        'display': ['Orbitron', 'Oxanium', 'sans-serif'],
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'spawn': 'spawn 0.5s ease-out',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'glow-pulse': {
          '0%, 100%': { 
            textShadow: '0 0 10px #00FF41, 0 0 20px #00FF41, 0 0 30px #00FF41',
          },
          '50%': { 
            textShadow: '0 0 20px #00FF41, 0 0 40px #00FF41, 0 0 60px #00FF41',
          },
        },
        spawn: {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.8) translateY(-10px)',
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1) translateY(0)',
          },
        },
      },
      boxShadow: {
        'matrix': '0 0 10px rgba(0, 255, 65, 0.5)',
        'crt': 'inset 0 0 100px rgba(0, 255, 65, 0.1)',
      },
    },
  },
  plugins: [],
}

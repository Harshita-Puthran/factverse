/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'spin-reverse-slow': 'spin 30s linear infinite reverse',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'data-flow': 'data-flow 3s ease-in-out infinite',
        'scanner-sweep': 'scanner-sweep 1.5s linear infinite',
        'neon-glow': 'neon-glow 2s ease-in-out infinite',
        'electric-pulse': 'electric-pulse 1.5s ease-in-out infinite',
        'hologram-flicker': 'hologram-flicker 3s linear infinite',
        'cyber-glitch': 'cyber-glitch 0.3s ease-in-out infinite',
        'particle-orbit': 'particle-orbit 4s linear infinite',
        'digital-wave': 'digital-wave 2s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'typing-dots': 'typing-dots 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(1.2)', opacity: '0' },
        },
        'data-flow': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'scanner-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'neon-glow': {
          '0%, 100%': { 
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
            transform: 'scale(1)'
          },
          '50%': { 
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            transform: 'scale(1.05)'
          },
        },
        'electric-pulse': {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
          '100%': { boxShadow: '0 0 5px currentColor' },
        },
        'hologram-flicker': {
          '0%, 100%': { opacity: '1' },
          '95%': { opacity: '1' },
          '96%': { opacity: '0.8' },
          '97%': { opacity: '1' },
          '98%': { opacity: '0.9' },
          '99%': { opacity: '1' },
        },
        'cyber-glitch': {
          '0%, 100%': { transform: 'translate(0)', filter: 'hue-rotate(0deg)' },
          '10%': { transform: 'translate(-2px, 2px)', filter: 'hue-rotate(90deg)' },
          '20%': { transform: 'translate(-2px, -2px)', filter: 'hue-rotate(180deg)' },
          '30%': { transform: 'translate(2px, 2px)', filter: 'hue-rotate(270deg)' },
          '40%': { transform: 'translate(2px, -2px)', filter: 'hue-rotate(360deg)' },
          '50%': { transform: 'translate(-2px, 2px)' },
        },
        'particle-orbit': {
          '0%': { transform: 'rotate(0deg) translateX(50px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(50px) rotate(-360deg)' },
        },
        'digital-wave': {
          '0%': { transform: 'translateX(-100%) skewX(-45deg)' },
          '100%': { transform: 'translateX(200%) skewX(-45deg)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        'typing-dots': {
          '0%, 20%': { color: 'transparent', textShadow: '.25em 0 0 transparent, .5em 0 0 transparent' },
          '40%': { color: 'currentColor', textShadow: '.25em 0 0 transparent, .5em 0 0 transparent' },
          '60%': { textShadow: '.25em 0 0 currentColor, .5em 0 0 transparent' },
          '80%, 100%': { textShadow: '.25em 0 0 currentColor, .5em 0 0 currentColor' },
        },
      },
    },
  },
  plugins: [],
}
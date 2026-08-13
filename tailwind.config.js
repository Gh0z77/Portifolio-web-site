/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Asosiy fon ranglar — statik
        bg: '#04060c',
        panel: '#0a0f1e',
        navy: {
          DEFAULT: '#0e2a66',
          900: '#081736',
          800: '#0b2050',
          700: '#123a8c',
        },
        steel: {
          DEFAULT: '#44578a',
          light: '#8b9cc7',
          dim: '#2c3a61',
        },
        // Brend ranglar — CSS o'zgaruvchilar orqali (admin paneldan o'zgartiriladi)
        matrix: {
          DEFAULT: 'rgb(var(--clr-matrix) / <alpha-value>)',
          bright: 'rgb(var(--clr-matrix-bright) / <alpha-value>)',
          dim: 'rgb(var(--clr-matrix-dim) / <alpha-value>)',
          dark: 'rgb(var(--clr-matrix-dark) / <alpha-value>)',
        },
        amber: {
          DEFAULT: 'rgb(var(--clr-amber) / <alpha-value>)',
          bright: 'rgb(var(--clr-amber-bright) / <alpha-value>)',
          dim: 'rgb(var(--clr-amber-dim) / <alpha-value>)',
        },
        // Rang USTIDAGI matn uchun avtomatik kontrast (tema bilan hisoblanadi)
        onmatrix: 'rgb(var(--clr-on-matrix) / <alpha-value>)',
        onamber: 'rgb(var(--clr-on-amber) / <alpha-value>)',
        ghost: '#e8ecf5',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 20px rgb(var(--clr-matrix) / 0.35), 0 0 60px rgb(var(--clr-matrix) / 0.12)',
        'glow-amber': '0 0 20px rgb(var(--clr-amber) / 0.35), 0 0 60px rgb(var(--clr-amber) / 0.12)',
        'glow-navy': '0 0 30px rgba(18, 58, 140, 0.4)',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.6' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.8' },
          '97%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-border': {
          '0%, 100%': { borderColor: 'rgb(var(--clr-matrix) / 0.4)' },
          '50%': { borderColor: 'rgb(var(--clr-matrix) / 0.9)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'bug-legs': {
          '0%, 100%': { transform: 'rotate(-14deg)' },
          '50%': { transform: 'rotate(14deg)' },
        },
      },
      animation: {
        blink: 'blink 1.1s step-end infinite',
        scanline: 'scanline 7s linear infinite',
        flicker: 'flicker 6s linear infinite',
        float: 'float 5s ease-in-out infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
        'pulse-border': 'pulse-border 2.4s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
}

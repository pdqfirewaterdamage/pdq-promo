import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef3fb',
          100: '#d4e0f4',
          200: '#a9c1e9',
          300: '#7099d8',
          400: '#3f6fc0',
          500: '#2553a3',
          600: '#1b4185',
          700: '#16336a',
          800: '#0f244e',
          900: '#0b1d3a',
          950: '#060f20',
        },
        accent: {
          50: '#fff5ed',
          100: '#ffe7d3',
          200: '#ffcaa6',
          300: '#ffa46d',
          400: '#ff7a33',
          500: '#ff5c0a',
          600: '#f04400',
          700: '#c63500',
          800: '#9d2c08',
          900: '#7e280c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,124,51,0.25), 0 8px 40px -8px rgba(255,92,10,0.45)',
      },
    },
  },
  plugins: [],
} satisfies Config;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: {
          DEFAULT: '#121215',
          subtle: '#18181c',
          border: '#27272a',
          muted: '#3f3f46',
        },
        brand: {
          crimson: '#ff0055',
          cyan: '#00f0ff',
          amber: '#f59e0b',
          white: '#fafafa',
          gray: '#a1a1aa',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-syne)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(255, 0, 85, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(255, 0, 85, 0.8))' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

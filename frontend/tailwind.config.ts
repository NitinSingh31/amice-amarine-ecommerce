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
        background: '#FAF7F2',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F4EEE5',
          border: '#E5EDE6',
          muted: '#8EA895',
        },
        linen: {
          50: '#FAF7F2',
          100: '#F4EEE5',
          200: '#E9E0D3',
          300: '#D5C7B5',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E5EDE6',
          200: '#CBEDD0',
          300: '#A9C5B0',
          400: '#8EA895',
          500: '#738E7B',
          600: '#5B7362',
          700: '#46584C',
          800: '#334037',
          900: '#222B25',
          950: '#18221C',
        },
        terracotta: {
          50: '#FDF7F4',
          100: '#F9ECE5',
          200: '#F3D8CC',
          300: '#E8BCA9',
          400: '#DA9B81',
          500: '#C87856',
          600: '#B56241',
          700: '#964E32',
        },
        ochre: {
          50: '#FBF9F2',
          100: '#F5EEDF',
          200: '#EBD9BD',
          300: '#DDBF93',
          400: '#CCA169',
          500: '#BF8946',
          600: '#A77037',
        },
        brand: {
          crimson: '#C87856',
          cyan: '#738E7B',
          amber: '#CCA169',
          white: '#222B25',
          gray: '#5B7362',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['Courier New', 'monospace'],
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
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(200, 120, 86, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(200, 120, 86, 0.8))' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

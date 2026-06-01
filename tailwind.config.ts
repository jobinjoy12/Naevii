import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        plum:  '#5b2d8e',
        dusk:  '#2c1a3a',
        pearl: '#faf8f5',
        blush: '#f4dce8',
        mist:  '#ede8f5',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:    ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft:   '0 2px 16px rgba(44,26,58,0.07), 0 1px 3px rgba(44,26,58,0.05)',
        lifted: '0 8px 32px rgba(44,26,58,0.12), 0 2px 8px rgba(44,26,58,0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
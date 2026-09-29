/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#a23a6f',
          dark: '#7f2856',
          light: '#d98ab2',
        },
        brass: {
          DEFAULT: '#b96b54',
          dark: '#92503f',
          light: '#e2aa95',
        },
        ink: {
          DEFAULT: '#3b2940',
          muted: '#75657b',
        },
        paper: {
          DEFAULT: '#fff8fc',
          surface: '#ffffff',
        },
        parchment: '#fff7fb',
        charcoal: {
          surface: '#ffffff',
        },
        lavender: '#9b7edb',
        rose: {
          DEFAULT: '#e76fa8',
          dark: '#c94e8a',
        },
      },
      borderRadius: {
        xl2: '1rem',
      },
      boxShadow: {
        dreamy: '0 18px 50px -28px rgba(137, 53, 102, 0.28)',
        'dreamy-lg': '0 28px 70px -35px rgba(137, 53, 102, 0.32)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

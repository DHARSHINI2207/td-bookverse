/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./apps/web/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#fff7fb",
        ink: "#3b2940",
        forest: "#8f3f6d",
        brass: "#b7799d",
        muted: "#806f7d",
        lavender: "#9b7edb",
        rose: "#d96b9b",
      },

      keyframes: {
        shimmer: {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },

        float: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-8px)",
          },
        },
      },

      animation: {
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#FFF9FC", surface: "#FFFFFF" },
        rose: { DEFAULT: "#EC4899", light: "#F9A8D4", pale: "#FCE7F3", dark: "#BE185D" },
        lavender: { DEFAULT: "#A855F7", light: "#C4B5FD", pale: "#F3E8FF" },
        ink: { DEFAULT: "#334155", muted: "#64748B" },
        charcoal: { DEFAULT: "#14171D", surface: "#1B2029", surface2: "#222834" },
        parchment: "#ECE6D8",
        forest: { DEFAULT: "#DB2777", light: "#F472B6", dark: "#BE185D" },
        brass: { DEFAULT: "#A855F7", light: "#C4B5FD", dark: "#7E22CE" },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(34, 29, 23, 0.06), 0 8px 24px -12px rgba(34, 29, 23, 0.18)",
        "card-hover": "0 4px 12px rgba(34, 29, 23, 0.08), 0 16px 40px -16px rgba(34, 29, 23, 0.28)",
      },
      borderRadius: { xl2: "0.875rem" },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(var(--rot, 0deg))" },
          "50%": { transform: "translateY(-10px) rotate(var(--rot, 0deg))" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;

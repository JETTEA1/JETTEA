import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        forest: {
          DEFAULT: "#0F3822",
          deep: "#092315",
          light: "#1A5233",
          emerald: "#10B981",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          accent: "#F3C623",
          warm: "#E8B208",
        },
        tea: {
          bg: "#F9FAF6",
          surface: "#FFFFFF",
          muted: "#F1F5F0",
          border: "#E2EBE1",
          dark: "#0E1812",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(15, 56, 34, 0.06)",
        card: "0 10px 30px -4px rgba(15, 56, 34, 0.08)",
        glow: "0 0 25px -3px rgba(243, 198, 35, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;

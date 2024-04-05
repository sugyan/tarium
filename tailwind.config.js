/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: 'monospace'
      },
      colors: {
        foreground: "rgb(var(--foreground))",
        background: "rgb(var(--background))",
        muted: "rgb(var(--muted))",
        "more-muted": "rgb(var(--more-muted))",
      },
    },
  },
  plugins: [],
};

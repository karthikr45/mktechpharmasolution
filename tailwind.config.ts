import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9ecff",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
          900: "#0b1f4a",
        },
        pharma: {
          bg: "#0a0f1e",
          panel: "#111a33",
          border: "#1f2a4a",
          accent: "#38bdf8",
          good: "#22c55e",
          warn: "#f59e0b",
          bad: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        mist: "#f5f7fb",
        line: "#d8dee9",
        accent: "#1d6f8f",
        evergreen: "#0f5d57"
      },
      boxShadow: {
        soft: "0 16px 48px rgba(23, 32, 51, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;

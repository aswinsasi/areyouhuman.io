import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#06080d",
          card: "#0C1018",
          border: "#1A2030",
          cyan: "#00F0FF",
          green: "#00FF88",
          magenta: "#FF00AA",
          amber: "#FFAA00",
          violet: "#AA66FF",
          text: "#E0E8F0",
          muted: "#667788",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

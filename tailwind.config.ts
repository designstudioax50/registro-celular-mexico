import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "sans-serif"],
      },
      colors: {
        void: "#060914",
        panel: "#0b1220",
        sky: {
          glow: "#38bdf8",
        },
        ink: "#e8eefc",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(26px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(30px, -40px) scale(1.08)" },
        },
        "float-slow-2": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(-40px, 30px) scale(1.12)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.04)" },
        },
        "sheen": {
          "0%": { transform: "translateX(-120%)" },
          "60%, 100%": { transform: "translateX(220%)" },
        },
        "tick": {
          "0%": { transform: "translateY(-6px)", opacity: "0.4" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 1.2s ease both",
        "float-slow": "float-slow 16s ease-in-out infinite",
        "float-slow-2": "float-slow-2 20s ease-in-out infinite",
        "glow-pulse": "glow-pulse 5s ease-in-out infinite",
        "sheen": "sheen 4.5s ease-in-out infinite",
        "tick": "tick 0.4s ease",
      },
    },
  },
  plugins: [],
};

export default config;

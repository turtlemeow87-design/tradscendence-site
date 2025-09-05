/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#111111",
        ivory: "#F5F1E8",
        rosewood: "#6E2A2A",
        gold: "#C2A45F",
        "gold-dark": "#A38C4C",
        line: "rgba(0,0,0,0.6)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Cinzel", "ui-serif", "serif"],
      },
      keyframes: {
        fadeslide: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: { fadeslide: "fadeslide 300ms ease both" },
    },
  },
  plugins: [],
};

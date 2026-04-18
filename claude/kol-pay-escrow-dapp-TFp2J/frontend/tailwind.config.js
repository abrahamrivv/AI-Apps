/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        neon: "#00FFC8"
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"]
      }
    }
  },
  plugins: []
};

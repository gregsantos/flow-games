/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      transparent: "transparent",
      black: "#000",
      white: "#fff",
      gray: {
        100: "#f7fafc",
        900: "#1a202c",
      },
      green: "#41FF00",
      green2: "#5bf870",
      test: "red",
      // 800: "#153e75",
      // 700: "#2a69ac",
    },
    fontFamily: {
      sans: ["Avenir Next", "sans-serif"],
      serif: ["Merriweather", "serif"],
      mono: ["VT323", "monospace"],
    },
  },
  plugins: [],
};

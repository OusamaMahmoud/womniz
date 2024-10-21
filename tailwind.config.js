/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
    require("daisyui"), // DaisyUI plugin
    require("tailwindcss-rtl"), // TailwindCSS RTL plugin
  ],
};

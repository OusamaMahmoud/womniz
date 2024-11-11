/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        womnizColor: '#577656', // Replace with your specific color
        womnizColorLight: '#BED3C4', // Replace with your specific color
      },
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

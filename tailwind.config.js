/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ebook-bg': '#F9F9F7', // Warna krem pucat khas kertas
        'ebook-dark': '#1A1A1A',
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0d1117',
        'dark-card': '#161b22',
        'accent-cyan': '#00d9ff',
        'accent-orange': '#f78166',
      },
    },
  },
  plugins: [],
}

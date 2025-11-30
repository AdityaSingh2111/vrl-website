/** @type {import('postcss').Config} */
export default {
  plugins: {
    // 1. Load the Tailwind CSS plugin first
    tailwindcss: {},
    // 2. Add vendor prefixes for better browser compatibility
    autoprefixer: {},
  },
}
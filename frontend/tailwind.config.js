/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Explicitly exclude node_modules to prevent the warning
  corePlugins: {
    preflight: true,
  },
};

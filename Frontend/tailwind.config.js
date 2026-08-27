/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#F3C9A7',
          secondary: '#D8AF8A',
          text: '#3C3D42',
          error: '#D95F5F',
          dashboard: '#F5F5F5',
          active: 'rgba(244, 162, 89, 0.25)',
          hover: 'rgba(244, 162, 89, 0.20)',
        },
      },
    },
  },
  plugins: [],
};

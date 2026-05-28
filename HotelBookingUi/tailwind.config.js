/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette màu sang trọng cho khách sạn (kết hợp các tông màu nâu ấm, kem và xám đậm)
        brand: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        gold: {
          50: '#fbf9f4',
          100: '#f7f1e4',
          200: '#eddcb9',
          300: '#e0c286',
          400: '#d0a252',
          500: '#bc8732',
          600: '#9e6d24',
          700: '#7e531c',
          800: '#603f17',
          900: '#4a3215',
          950: '#2b1c0b',
        }
      }
    },
  },
  plugins: [],
}


module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        'blue-primary': '#0118D8',
        'blue-secondary': '#1B56FD',
        'beige': '#E9DFC3',
        'offwhite': '#FFF8F8',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        'inner-lg': 'inset 0 2px 10px rgba(0, 0, 0, 0.05)',
      },
      transitionProperty: {
        'scale': 'transform, opacity, box-shadow',
      },
    },
  },
  plugins: [],
}
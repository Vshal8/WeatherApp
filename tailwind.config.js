const nativewind = require("nativewind/tailwind/native")

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./<custom directory>/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'base-bg': '#d7d7d7',
      'white': '#ffffff',
      'gray-text': '#b7b7b7',
      'light-bg': '#f7f7f7',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
    },
    maxWidth: {
      '1/2': '50%',
      '1/4': '25%'
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
  plugins: [nativewind()],
}
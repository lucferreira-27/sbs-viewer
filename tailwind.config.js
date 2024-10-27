module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'paper': '#f4ecd8',
          'ink': '#2c2c2c',
          'accent': '#e74c3c',
        },
        keyframes: {
          'fade-in': {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          }
        },
        animation: {
          'fade-in': 'fade-in 0.5s ease-out',
        }
      },
    },
    plugins: [],
  }
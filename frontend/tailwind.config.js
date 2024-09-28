
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cherryMatte: {
          DEFAULT: '#D2042D', // Base cherry red
          light: '#E3425D', // Lighter shade
          dark: '#A00220', // Darker shade
        },
      },
      keyframes: {
        animation: {
          'spin-slow': 'spin 3s linear infinite',
          wiggle: 'wiggle 1s ease-in-out infinite',
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      backgroundImage: {
        'sea1':'url("./him1.jpg")',
        'sea2':'url("./him2.jpg")',
        'sea3':'url("./him3.jpg")',
        'sea4':'url("./him4.jpg")',
        // 'sea2': 'url("https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")',
        // 'sea2': 'url("https://images.unsplash.com/photo-1524704654690-b56c05c78a00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80")',
        // 'sea3': 'url("https://images.unsplash.com/photo-1503177847378-d2048487fa46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80")',
        "test-img":'url("./img.jpg")',
      }
    },
  },
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}
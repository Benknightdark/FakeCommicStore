module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './pages/utils/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'nmd': '641px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      height: {
        '128': '32rem',
      },
      zIndex: {
        '100': '100',
        '999':'999'
      },
      typography: (theme) => ({
        dark: {
          css: {
            color: theme('colors.gray.300'),
            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      typography: ['dark'],
    },
  },
  plugins: [
    require("daisyui"),
    require('@tailwindcss/aspect-ratio'),
  ],

}

// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10141E",
        secondary: "#FC4747",
        tertiary: "#161D2F",
        quaternary: "#5A698F",
        quinary: "#FFFFFF",
      },
      fontSize: {
        'heading-lg': ['32px', { lineHeight: '1' }],
        'heading-md': ['24px', { lineHeight: '1' }],
        'heading-sm': ['18px', { lineHeight: '1' }],
        'heading-xs': ['13px', { lineHeight: '1' }],
        'body-md': ['15px', { lineHeight: '1.5' }],
        'body-sm': ['13px', { lineHeight: '1.5' }],
      },
    },
  },
  variants: {
    fill: ['hover', 'focus'],
  },
  plugins: [],
}
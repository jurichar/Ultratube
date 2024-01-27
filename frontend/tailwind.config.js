// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#10141E",
        secondary: "#FC4747",
        tertiary: "#161D2F",
        quaternary: "#5A698F",
        quinary: "#FFFFFF",
        discord: "#7289DA",
        github: "#2dba4e",
      },
      fontSize: {
        "heading-lg": ["32px", { fontWeight: "300", letterSpacing: "-0.031em", lineHeight: "normal" }],
        "heading-md": ["24px", { lineHeight: "1" }],
        "heading-sm": ["18px", { lineHeight: "1" }],
        "heading-xs": ["13px", { lineHeight: "1" }],
        "body-md": ["15px", { lineHeight: "1.5", fontWeight: "300" }],
        "body-sm": ["13px", { lineHeight: "1.5" }],
      },
      fontWeight: {
        thin: "100",
        hairline: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        "extra-bold": "800",
        black: "900",
      },
      fontFamily: {
        custom: ['"Outfit"', "sans-serif"],
      },
      keyframes: {
        wiggle: {
          "0%, 25%": { width: "0%", marginLeft: "50%" },
          "25%, 100%": { width: "100%", marginLeft: "0%" },
        },
        wiggleout: {
          "0%, 25%": { width: "100%", marginLeft: "0%" },
          "25%, 100%": { width: "0%", marginLeft: "50%" },
        },
      },
      animation: {
        wiggle: "wiggle 0.2s ease ",
        wiggleout: "wiggleout 0.2s ease ",
      },
    },
    variants: {
      fill: ["hover", "focus"],
    },
  },
  plugins: [],
};

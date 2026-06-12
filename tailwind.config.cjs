const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, "index.html"),
    path.join(__dirname, "src/**/*.{vue,js,ts}"),
  ],
  theme: {
    extend: {
      colors: {
        expenzey: {
          50: "#f5f3ff",
          100: "#ede9fe",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Oxygen-Sans",
          "Ubuntu",
          "Cantarell",
          '"Helvetica Neue"',
          "sans-serif",
        ],
      },
      fontSize: {
        xs: ["11px", { lineHeight: "1.4" }],
        sm: ["12px", { lineHeight: "1.4" }],
        base: ["13px", { lineHeight: "1.4" }],
        lg: ["14px", { lineHeight: "1.4" }],
        xl: ["18px", { lineHeight: "1.3" }],
        "2xl": ["20px", { lineHeight: "1.25" }],
        "3xl": ["22px", { lineHeight: "1.25" }],
      },
    },
  },
  plugins: [],
};

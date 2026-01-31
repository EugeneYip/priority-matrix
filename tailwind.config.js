/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 14px 40px -24px rgba(15, 23, 42, 0.35)",
        card: "0 10px 25px -18px rgba(15, 23, 42, 0.4)"
      }
    }
  },
  plugins: []
};

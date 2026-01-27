/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        c1: '#E7E0CF',
        c2: '#D7D6C2',
        c3: '#C6CCB6',
        c4: '#ACBFAF',
        c5: '#9DB8AC',
        c6: '#8FB1AA',
        c7: '#779EAB',
        c8: '#628AA3',
        c9: '#4F7392',
        c10: '#476786',
        c11: '#3E5C7A',
        white: '#fff',
        eggshell: '#f0ebe1',
        black: '#111',
        coral: '#E6725E',
        highlight: '#E6725E',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
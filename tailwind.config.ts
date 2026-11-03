import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Warm organic agency palette from reference image
        canvas: "#F4F3EE",
        stone: {
          50: "#FAF9F6",
          100: "#F4F3EE",
          200: "#E9E7DF",
          300: "#D8D4C8",
          400: "#B8B2A1",
          500: "#968E7A",
          800: "#2B2821",
          900: "#1A1916",
        },
        forest: {
          50: "#F2F7F4",
          100: "#E2EFE7",
          200: "#C4DFC2",
          600: "#2B6846",
          700: "#205136",
          800: "#1B412C",
          900: "#153323",
          950: "#0D2116",
        },
      },
    },
  },
  plugins: [],
};
export default config;

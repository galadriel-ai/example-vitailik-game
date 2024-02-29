import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "fight": "url('/fight.png')",
      },
    },
    fontFamily: {
      PPMondwest: ['PPMondwest-Regular', 'sans-serif'],
    },
    colors: {
      brand: {
        blue: "#0657e0",
        bluedark: "#002360",
        neongreen: "#00ff66"
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};
export default config;

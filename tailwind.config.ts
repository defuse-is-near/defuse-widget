import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"
import colors from "tailwindcss/colors"
import plugin from "tailwindcss/plugin"
import forms from "@tailwindcss/forms"
import typography from "@tailwindcss/typography"
import lineClamp from "@tailwindcss/line-clamp"

const config: Config = {
  darkMode: "selector",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["CircularXXSub", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        "6xl": [
          "4rem",
          {
            lineHeight: "4rem",
            letterSpacing: "0.04rem",
          },
        ],
        "3xl": [
          "2rem",
          {
            lineHeight: "2.5rem",
            letterSpacing: "0.02rem",
          },
        ],
      },
      spacing: {
        "2px": "2px",
        15: "3.75rem",
      },
      maxWidth: {
        "5xl": "65rem", // 1040px
        "8xl": "95rem",
      },
      colors: {
        white: {
          DEFAULT: "rgba(253, 253, 252, 1)",
          200: "rgba(32, 16, 0, 0.06)",
        },
        black: {
          DEFAULT: "#041417",
          600: "rgba(22, 22, 21, 1)",
          500: "rgba(28, 32, 36, 1)",
          400: "rgba(33, 32, 28, 1)",
          300: "rgba(4, 20, 23, 1)",
        },
        gray: {
          ...colors.gray,
          DEFAULT: "rgba(249, 249, 248, 1)",
          950: "rgba(241, 240, 239, 1)",
          900: "rgba(141, 141, 141, 1)",
          800: "rgba(249, 249, 249, 1)",
          700: "rgba(100, 100, 100, 1)",
          600: "rgba(99, 99, 94, 1)",
          500: "rgba(187, 187, 187, 1)",
          400: "rgba(217, 217, 217, 1)",
          300: "rgba(228, 228, 228, 1)",
          200: "rgba(241, 241, 241, 1)",
          100: "rgba(233, 232, 230, 1)",
          50: "rgba(249, 249, 248, 1)",
        },
        silver: {
          200: "rgba(139, 141, 152, 1)",
          100: "rgba(31, 24, 0, 0.13)",
        },
        blue: {
          300: "#101d46",
        },
        red: {
          400: "rgba(204, 78, 0, 0.77)",
          100: "rgba(255, 156, 0, 0.16)",
        },
        green: {
          100: "rgba(0, 164, 51, 0.1)",
          DEFAULT: "rgba(0, 113, 63, 0.87)",
        },
        primary: {
          DEFAULT: "rgba(247, 107, 21, 1)",
        },
        secondary: "rgba(128, 128, 128, 1)",
      },
      boxShadow: {
        paper:
          "0px 8px 40px 0px rgba(0, 0, 0, 0.05), 0px 12px 32px -16px rgba(32, 16, 0, 0.06);",
        widget:
          "0px 12px 62px 0px rgba(0, 0, 0, 0.15), 0px 12px 32px -16px rgba(31, 24, 0, 0.13)",
        "select-token":
          "0px 0px 0px 0.5px rgba(0, 0, 0, 0.05), 0px 1px 4px 0px rgba(31, 21, 0, 0.1), 0px 2px 1px -1px rgba(0, 0, 0, 0.05), 0px 1px 3px 0px rgba(0, 0, 0, 0.05)",
      },
      scale: {
        103: "1.03",
      },
      borderRadius: {
        "4xl": "1.875rem",
      },
      backgroundImage: {
        "page-light": "url('/static/images/bg-light.svg')",
        "page-dark": "url('/static/images/bg-dark.svg')",
        "page-light--mobile": "url('/static/images/bg-light--mobile.svg')",
      },
    },
  },
  plugins: [
    forms,
    typography,
    lineClamp,
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".hide-scrollbar": {
          "scrollbar-width": "none",
          "-ms-overflow-style": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },

        ".hide-spinners": {
          "-moz-appearance": "textfield",
          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: "0",
          },
        },
      }
      addUtilities(newUtilities)
    }),
  ],
}
export default config

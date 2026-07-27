/** @type {import('tailwindcss').Config} */

/** Цвета и геометрия — только CSS vars из src/app/globals.css (SSOT). */

export default {

  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {

    colors: {

      transparent: "transparent",

      current: "currentColor",

      background: "var(--color-background)",

      foreground: "var(--color-foreground)",

      primary: "var(--color-primary)",

      "primary-foreground": "var(--color-primary-foreground)",

      secondary: "var(--color-secondary)",

      "secondary-foreground": "var(--color-secondary-foreground)",

      muted: "var(--color-muted)",

      surface: "var(--color-surface)",

      "surface-muted": "var(--color-surface-muted)",

      "surface-strong": "var(--color-surface-strong)",

      "on-surface-strong": "var(--color-on-surface-strong)",

      border: "var(--color-border)",

      "border-strong": "var(--color-border-strong)",

      "border-dashed": "var(--color-border-dashed)",

      "text-subtle": "var(--color-text-subtle)",

      "on-primary": "var(--color-on-primary)",

      ring: "var(--color-ring)",

      accent: "var(--color-accent)",

      "accent-foreground": "var(--color-accent-foreground)",

      destructive: "var(--color-destructive)",

      "destructive-foreground": "var(--color-destructive-foreground)",

      input: "var(--color-input)",

      card: "var(--color-card)",

      "card-foreground": "var(--color-card-foreground)",

      bizon: {

        black: "var(--bizon-black)",

        white: "var(--bizon-white)",

        light: "var(--bizon-light)",

        light2: "var(--bizon-light-2)",

        gray: "var(--bizon-gray)",

        dark: "var(--bizon-dark)",

        accent: "var(--bizon-accent)",

        accentDark: "var(--bizon-accent-dark)",

        coral: {
          50: "var(--bizon-coral-50)",
          100: "var(--bizon-coral-100)",
          200: "var(--bizon-coral-200)",
          300: "var(--bizon-coral-300)",
          400: "var(--bizon-coral-400)",
          500: "var(--bizon-coral-500)",
          600: "var(--bizon-coral-600)",
          700: "var(--bizon-coral-700)",
          800: "var(--bizon-coral-800)",
          900: "var(--bizon-coral-900)",
        },

        mint: {
          50: "var(--bizon-mint-50)",
          100: "var(--bizon-mint-100)",
          200: "var(--bizon-mint-200)",
          300: "var(--bizon-mint-300)",
          400: "var(--bizon-mint-400)",
          500: "var(--bizon-mint-500)",
          600: "var(--bizon-mint-600)",
          700: "var(--bizon-mint-700)",
          800: "var(--bizon-mint-800)",
          900: "var(--bizon-mint-900)",
        },

        neutral: {
          50: "var(--bizon-neutral-50)",
          100: "var(--bizon-neutral-100)",
          200: "var(--bizon-neutral-200)",
          300: "var(--bizon-neutral-300)",
          400: "var(--bizon-neutral-400)",
          500: "var(--bizon-neutral-500)",
          600: "var(--bizon-neutral-600)",
          700: "var(--bizon-neutral-700)",
          800: "var(--bizon-neutral-800)",
          900: "var(--bizon-neutral-900)",
          950: "var(--bizon-neutral-950)",
        },

      },

    },

    borderColor: ({ theme }) => theme("colors"),

    borderRadius: {

      DEFAULT: "var(--radius-control)",

      sm: "calc(var(--radius-control) - 4px)",

      md: "calc(var(--radius-control) - 2px)",

      lg: "var(--radius-control)",

      xl: "var(--radius-card)",

      "2xl": "var(--radius-panel)",

      "3xl": "var(--radius-panel)",

      "4xl": "var(--radius-panel)",

    },

    fontFamily: {

      sans: ["var(--font-sans)"],

    },

  },

  plugins: [],

};



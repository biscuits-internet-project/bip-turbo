/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "star-pulse": {
          "0%": {
            transform: "scale(1)",
            filter: "drop-shadow(0 0 0 rgba(250, 204, 21, 0))",
          },
          "50%": {
            transform: "scale(1.2)",
            filter: "drop-shadow(0 0 4px rgba(250, 204, 21, 0.6))",
          },
          "100%": {
            transform: "scale(1)",
            filter: "drop-shadow(0 0 0 rgba(250, 204, 21, 0))",
          },
        },
        "star-glow": {
          "0%": { filter: "brightness(100%)" },
          "50%": { filter: "brightness(150%)" },
          "100%": { filter: "brightness(100%)" },
        },
        "rating-update": {
          "0%": {
            transform: "scale(1)",
            filter: "brightness(100%) drop-shadow(0 0 0 rgba(250, 204, 21, 0))",
          },
          "50%": {
            transform: "scale(1.4)",
            filter: "brightness(150%) drop-shadow(0 0 8px rgba(250, 204, 21, 0.8))",
          },
          "100%": {
            transform: "scale(1)",
            filter: "brightness(100%) drop-shadow(0 0 0 rgba(250, 204, 21, 0))",
          },
        },
        "avg-rating-update": {
          "0%": {
            transform: "scale(1)",
            filter: "brightness(100%)",
          },
          "40%": {
            transform: "scale(1.5)",
            filter: "brightness(150%) drop-shadow(0 0 12px rgba(250, 204, 21, 0.9))",
          },
          "100%": {
            transform: "scale(1)",
            filter: "brightness(100%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "star-pulse": "star-pulse 0.6s ease-in-out",
        "star-glow": "star-glow 0.6s ease-in-out",
        "rating-update": "rating-update 1s ease-in-out",
        "avg-rating-update": "avg-rating-update 2s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
};
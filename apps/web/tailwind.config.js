/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base system colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          overlay: "hsl(var(--card-overlay))",
        },
        
        // Brand & Identity
        brand: {
          DEFAULT: "hsl(var(--brand-primary))",
          secondary: "hsl(var(--brand-secondary))",
          gradient: {
            start: "hsl(var(--brand-gradient-start))",
            mid: "hsl(var(--brand-gradient-mid))",
            end: "hsl(var(--brand-gradient-end))",
          },
        },
        
        // Content Areas
        content: {
          bg: "hsl(var(--content-bg))",
          "bg-secondary": "hsl(var(--content-bg-secondary))",
          "text-primary": "hsl(var(--content-text-primary))",
          "text-secondary": "hsl(var(--content-text-secondary))",
          "text-tertiary": "hsl(var(--content-text-tertiary))",
        },
        
        // Interactive States
        hover: {
          accent: "hsl(var(--hover-accent))",
          subtle: "hsl(var(--hover-subtle))",
        },
        focus: {
          ring: "hsl(var(--focus-ring))",
        },
        active: {
          state: "hsl(var(--active-state))",
        },
        
        // Status & Feedback
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",
        rating: {
          gold: "hsl(var(--rating-gold))",
          dim: "hsl(var(--rating-dim))",
        },
        
        // Chart & Data
        chart: {
          primary: "hsl(var(--chart-primary))",
          secondary: "hsl(var(--chart-secondary))",
          tertiary: "hsl(var(--chart-tertiary))",
          accent: "hsl(var(--chart-accent))",
        },
        
        // Component-Specific
        nav: {
          "link-hover": "hsl(var(--nav-link-hover))",
        },
        search: {
          bg: "hsl(var(--search-bg))",
        },
        filter: {
          active: "hsl(var(--filter-active))",
        },
        table: {
          header: "hsl(var(--table-header))",
          "row-hover": "hsl(var(--table-row-hover))",
        },
        divider: "hsl(var(--divider))",
      },
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
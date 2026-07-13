import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1360px" },
    },
    extend: {
      colors: {
        // Semantic tokens (driven by CSS variables in globals.css -> rebrand = token change only)
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand red scale (energetic, boAt-inspired)
        brand: {
          50: "#FFF1F1",
          100: "#FFDFDF",
          200: "#FFC5C5",
          300: "#FF9B9B",
          400: "#FF6161",
          500: "#FF2E2E",
          600: "#EE1C25",
          700: "#C81420",
          800: "#A5131E",
          900: "#88151D",
          950: "#4B0509",
          DEFAULT: "#FF2E2E",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        glow: "0 0 0 1px hsl(var(--primary) / 0.35), 0 8px 40px -8px hsl(var(--primary) / 0.55)",
        "glow-lg": "0 0 60px -10px hsl(var(--primary) / 0.65)",
        card: "0 1px 0 0 hsl(0 0% 100% / 0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.9)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #FF3B3B 0%, #EE1C25 55%, #C81420 100%)",
        "radial-glow": "radial-gradient(60% 60% at 50% 0%, hsl(var(--primary) / 0.25) 0%, transparent 70%)",
        "grid-faint":
          "linear-gradient(hsl(0 0% 100% / 0.035) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.035) 1px, transparent 1px)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "hp-rotate": {
          "0%, 100%": { transform: "rotateY(-14deg)" },
          "50%": { transform: "rotateY(14deg)" },
        },
        ring: {
          "0%": { transform: "scale(0.5)", opacity: "0.55" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
        eq: {
          "0%, 100%": { height: "8px" },
          "50%": { height: "30px" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "gradient-pan": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        rise: {
          "0%": { transform: "translateY(20px) scale(1)", opacity: "0" },
          "12%": { opacity: "0.7" },
          "100%": { transform: "translateY(-160px) scale(0.3)", opacity: "0" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "33%": { transform: "translate(42px, -34px)" },
          "66%": { transform: "translate(-34px, 24px)" },
        },
        shine: {
          "0%": { transform: "translateX(-160%) skewX(-12deg)" },
          "100%": { transform: "translateX(260%) skewX(-12deg)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 32s) linear infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "hp-rotate": "hp-rotate 9s ease-in-out infinite",
        ring: "ring 3.2s ease-out infinite",
        eq: "eq 1s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "gradient-pan": "gradient-pan 4s linear infinite",
        rise: "rise 6s linear infinite",
        drift: "drift 16s ease-in-out infinite",
        shine: "shine 3.5s ease-in-out infinite",
        bob: "bob 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // JazzyVault brand palette
        brand: {
          primary: "#2563EB",
          secondary: "#7C3AED",
          accent: "#06B6D4",
          bg: "#0F172A",
          textPrimary: "#FFFFFF",
          textSecondary: "#CBD5E1",
        },
        border: "rgba(203, 213, 225, 0.12)",
        input: "rgba(203, 213, 225, 0.16)",
        ring: "#2563EB",
        background: "#0F172A",
        foreground: "#FFFFFF",
        muted: {
          DEFAULT: "#1E293B",
          foreground: "#94A3B8",
        },
        card: {
          DEFAULT: "#111B30",
          foreground: "#FFFFFF",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
        "brand-gradient-radial":
          "radial-gradient(circle at top, #1E3A8A 0%, #0F172A 60%)",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(210 20% 12%)', // Slightly adjusted from pure Deep Charcoal for better readability
        foreground: 'hsl(0 0% 98%)',
        
        border: 'hsl(210 20% 15%)',
        input: 'hsl(210 20% 15%)',
        ring: 'hsl(220 87% 40%)',
        
        // Adjust other color variations to complement Deep Charcoal
        primary: {
          DEFAULT: 'hsl(220 87% 25%)',
          foreground: 'hsl(0 0% 98%)'
        },
        secondary: {
          DEFAULT: 'hsl(43 65% 53%)',
          foreground: 'hsl(0 0% 98%)'
        },
        destructive: {
          DEFAULT: 'hsl(0 70% 45%)',
          foreground: 'hsl(0 0% 98%)'
        },
        muted: {
          DEFAULT: 'hsl(210 20% 20%)',
          foreground: 'hsl(210 10% 75%)'
        },
        accent: {
          DEFAULT: 'hsl(43 65% 53%)',
          foreground: 'hsl(0 0% 98%)'
        },
        popover: {
          DEFAULT: 'hsl(210 20% 15%)',
          foreground: 'hsl(0 0% 98%)'
        },
        card: {
          DEFAULT: 'hsl(210 20% 15%)',
          foreground: 'hsl(0 0% 98%)'
        },
        // Aura Finance specific colors
        aura: {
          'charcoal': '#212529',
          'dark-gray': '#333B48',
          'medium-gray': '#8892A0',
          'silver-gray': '#DDE2E7',
          'white': '#F5F7FA',
          'gold': '#D4AF37',
          'bright-gold': '#FFD700',
          'sapphire': '#0B3D91',
          'midnight': '#001F54',
          'primary-text': '#333B48',    // Dark Gray for primary text
          'secondary-text': '#8892A0',  // Medium Cool Gray for secondary text
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

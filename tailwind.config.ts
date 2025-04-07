
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(210 20% 12%)', // Dark charcoal background
        foreground: 'hsl(0 0% 98%)',     // Light text for dark background
        
        border: 'hsl(210 20% 15%)',
        input: 'hsl(210 20% 15%)',
        ring: 'hsl(220 87% 40%)',
        
        // Adjust other color variations for dark mode
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
          'primary-text': '#F5F7FA',    // Light text for dark mode
          'secondary-text': '#B8C0D0',  // Medium light gray for secondary text
          'success': '#4CAF50',         // Success color
          'error': '#F44336',           // Error color
        }
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif']
      },
      animation: {
        'gold-shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '0 0' },
        }
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

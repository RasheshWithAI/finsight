
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
        // Dark mode colors
        background: 'hsl(210 20% 12%)', // Deep Charcoal background
        foreground: 'hsl(0 0% 98%)',     // Light text for dark background
        
        border: 'hsl(210 20% 15%)',
        input: 'hsl(210 20% 15%)',
        ring: 'hsl(220 87% 40%)',
        
        // Adjust other color variations for dark mode
        primary: {
          DEFAULT: 'hsl(220 87% 25%)', // Deep Sapphire Blue
          foreground: 'hsl(0 0% 98%)'
        },
        secondary: {
          DEFAULT: 'hsl(43 65% 53%)', // Rich Gold
          foreground: 'hsl(0 0% 98%)'
        },
        destructive: {
          DEFAULT: 'hsl(0 70% 45%)',
          foreground: 'hsl(0 0% 98%)'
        },
        muted: {
          DEFAULT: 'hsl(210 20% 20%)', // Medium Cool Gray
          foreground: 'hsl(210 10% 75%)'
        },
        accent: {
          DEFAULT: 'hsl(43 65% 53%)', // Rich Gold
          foreground: 'hsl(0 0% 98%)'
        },
        popover: {
          DEFAULT: 'hsl(210 20% 15%)',
          foreground: 'hsl(0 0% 98%)'
        },
        card: {
          DEFAULT: 'hsl(210 20% 15%)', // Medium Cool Gray
          foreground: 'hsl(0 0% 98%)'
        },
        // Aura Finance specific colors
        aura: {
          'charcoal': '#212529', // Deep Charcoal
          'dark-gray': '#333B48', // Medium Cool Gray
          'medium-gray': '#8892A0',
          'silver-gray': '#DDE2E7',
          'white': '#F5F7FA', // Near White
          'gold': '#D4AF37', // Rich Gold
          'bright-gold': '#FFD700',
          'sapphire': '#0B3D91', // Deep Sapphire Blue
          'midnight': '#001F54', // Midnight Blue
          'primary-text': '#F5F7FA',    // Light text for dark mode
          'secondary-text': '#B8C0D0',  // Medium light gray for secondary text
          'success': '#8BC34A',         // Muted Green
          'error': '#F44336',           // Error color
          // Chart accent colors
          'chart-blue': '#88B0F4',      // Lighter Blue
          'chart-orange': '#F48C06',    // Vibrant Orange
          'chart-green': '#8BC34A',     // Muted Green
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

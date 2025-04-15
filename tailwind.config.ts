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
        // New dark mode colors
        background: 'hsl(225 12% 8%)', // Very dark charcoal #121217
        foreground: 'hsl(0 0% 100%)',  // Pure white
        
        border: 'hsl(225 10% 15%)',
        input: 'hsl(225 10% 15%)',
        ring: 'hsl(265 75% 40%)',
        
        primary: {
          DEFAULT: 'hsl(265 75% 53%)', // Vibrant Purple #8A2BE2
          foreground: 'hsl(0 0% 100%)' // White text on purple
        },
        secondary: {
          DEFAULT: 'hsl(330 100% 50%)', // Pink/Magenta #FF1493
          foreground: 'hsl(0 0% 100%)'
        },
        destructive: {
          DEFAULT: 'hsl(0 70% 45%)',
          foreground: 'hsl(0 0% 100%)'
        },
        muted: {
          DEFAULT: 'hsl(225 10% 17%)', // #1E1E24 - Card backgrounds
          foreground: 'hsl(0 0% 80%)'  // Light gray for muted text
        },
        accent: {
          DEFAULT: 'hsl(265 75% 53%)', // Same as primary (purple)
          foreground: 'hsl(0 0% 100%)'
        },
        popover: {
          DEFAULT: 'hsl(225 10% 17%)',
          foreground: 'hsl(0 0% 100%)'
        },
        card: {
          DEFAULT: 'hsl(225 10% 17%)', // #1E1E24 - slightly lighter dark gray
          foreground: 'hsl(0 0% 100%)'
        },
        // Aura Finance specific colors
        aura: {
          'charcoal': '#121217', // Very dark charcoal
          'dark-gray': '#1E1E24', // Slightly lighter dark gray
          'medium-gray': '#8892A0', // Medium gray for text
          'silver-gray': '#EAEAEA', // Light gray for text
          'white': '#FFFFFF', // Pure white
          'purple': '#8A2BE2', // Vibrant purple - primary accent
          'pink': '#FF1493', // Pink/Magenta - secondary accent
          'blue': '#007BFF', // Bright blue - secondary accent
          'orange': '#FFA500', // Orange - secondary accent
          'yellow': '#FFD700', // Yellow - secondary accent
          'primary-text': '#FFFFFF', // White text
          'secondary-text': '#EAEAEA', // Light gray for secondary text
          'success': '#4CAF50', // Success color
          'error': '#F44336', // Error color
          // Chart accent colors
          'chart-blue': '#007BFF',
          'chart-pink': '#FF1493',
          'chart-purple': '#8A2BE2',
          'chart-orange': '#FFA500',
          'chart-green': '#4CAF50',
        }
      },
      fontFamily: {
        'satoshi': ['Satoshi', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif']
      },
      animation: {
        'gold-shimmer': 'shimmer 2s linear infinite',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '0 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.5' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'primary-gradient': 'linear-gradient(to right, #8A2BE2, #6100FF)',
        'card-gradient': 'linear-gradient(to bottom right, #1E1E24, #282830)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

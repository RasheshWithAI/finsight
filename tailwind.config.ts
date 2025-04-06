import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        // Update base colors to use Deep Charcoal
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
          'midnight': '#001F54'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        'satoshi': ['Satoshi', 'sans-serif'],
        'manrope': ['Manrope', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'count-up': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(11, 61, 145, 0.2)' },
          '50%': { boxShadow: '0 0 0 8px rgba(11, 61, 145, 0)' }
        },
        'gold-shimmer': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' }
        },
        'liquid-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--fill-width)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-in-up': 'slide-in-up 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'count-up': 'count-up 0.5s ease-out',
        'pulse-glow': 'pulse-glow 1.5s infinite ease-in-out',
        'gold-shimmer': 'gold-shimmer 3s ease-in-out infinite',
        'liquid-fill': 'liquid-fill 1s ease-out forwards'
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, #0B3D91, #001F54)',
        'accent-gradient': 'linear-gradient(to right, #D4AF37, #FFD700)',
        'success-gradient': 'linear-gradient(to right, #8BC34A, #7CB342)',
        'error-gradient': 'linear-gradient(to right, #E57373, #EF5350)',
        'warning-gradient': 'linear-gradient(to right, #FFB74D, #FFA726)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

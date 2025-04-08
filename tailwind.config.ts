
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Aura Finance colors
				aura: {
					// Primary Gradient Colors
					'teal': '#005B64',
					'cyan': '#76D7C4',
					'sea-green': '#007A74',
					// Accent Gradient Colors
					'coral': '#FF7F50',
					'orange': '#FFAC70',
					// Neutral Colors
					'white': '#FDFEFF',
					'charcoal': '#1A1D21',
					'light-gray': '#F0F2F5',
					'dark-gray': '#2C3036',
					'black': '#101316',
					'off-white': '#EAECEF',
					'medium-gray': '#6B7280',
					'soft-gray': '#A0A7B0',
					// Status Colors
					'success': '#34D399',
					'error': '#F87171',
					'warning': '#FBBF24'
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
					'0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 91, 100, 0.2)' },
					'50%': { boxShadow: '0 0 0 8px rgba(0, 91, 100, 0)' }
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
				'liquid-fill': 'liquid-fill 1s ease-out forwards'
			},
			backgroundImage: {
				'primary-gradient': 'linear-gradient(to right, #005B64, #76D7C4, #007A74)',
				'accent-gradient': 'linear-gradient(to right, #FF7F50, #FFAC70)',
				'success-gradient': 'linear-gradient(to right, #34D399, #10B981)',
				'error-gradient': 'linear-gradient(to right, #F87171, #EF4444)',
				'warning-gradient': 'linear-gradient(to right, #FBBF24, #F59E0B)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

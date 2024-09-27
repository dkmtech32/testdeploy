import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)']
      },
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
        success: {
          DEFAULT: '#10b981', // Green
          foreground: '#ffffff',
        },
        info: {
          DEFAULT: '#3b82f6', // Blue
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#f59e0b', // Yellow
          foreground: '#000000',
        },
        error: {
          DEFAULT: '#dc2626', // Darker Red
          foreground: '#ffffff',
        },
        custom: {
          DEFAULT: '#6b7280', // Gray
          foreground: '#ffffff',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addComponents }:any) {
      addComponents({
        '.group-slider .slick-dots': {
          'bottom': '-25px',
        },
        '.group-slider .slick-dots li button:before': {
          'font-size': '10px',
          'color': '#4a5568',
        },
        '.dark .group-slider .slick-dots li button:before': {
          'color': '#e2e8f0',
        },
        '.group-slider .slick-dots li.slick-active button:before': {
          'color': '#2b6cb0',
        },
        '.dark .group-slider .slick-dots li.slick-active button:before': {
          'color': '#4299e1',
        },
      });
    }
  ]
} satisfies Config

export default config

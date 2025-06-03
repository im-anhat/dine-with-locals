/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', 'class'], // we can consider this if we have time (simple though ;) )

  // content: Specifies the files Tailwind CSS should scan for class names.
  // This is essential for optimizing the final CSS bundle by generating only the necessary or used styles.
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], //Scan all js, ts, jsx, tsx file in src folder and index.html

  /*
    theme: we use this section to customize the default design configuration
      - screens for customizing the default breakpoints.
      - colors for customizing the default color palette.
      - spacing for customizing the default spacing and sizing scale.
  */
  theme: {
  	extend: {
  		colors: {
  			'brand-orange': {
  				'50': '#fff7ed',
  				'100': '#ffedd5',
  				'200': '#fed7aa',
  				'300': '#fdba74',
  				'400': '#fb923c',
  				'500': '#f97316',
  				'600': '#ea580c',
  				'700': '#c2410c',
  				'800': '#9a3412',
  				'900': '#7c2d12'
  			},
  			'brand-coral': {
  				'50': '#fef2f2',
  				'100': '#fee2e2',
  				'200': '#fecaca',
  				'300': '#e57373',
  				'400': '#ef5350',
  				'500': '#e53935',
  				'600': '#dc2626',
  				'700': '#b91c1c',
  				'800': '#991b1b',
  				'900': '#7f1d1d'
  			},
  			'brand-stone': {
  				'50': '#fafaf9',
  				'100': '#f5f5f4',
  				'200': '#e7e5e4',
  				'300': '#d6d3d1',
  				'400': '#a8a29e',
  				'500': '#78716c',
  				'600': '#57534e',
  				'700': '#44403c',
  				'800': '#292524',
  				'900': '#1c1917'
  			},
  			'brand-teal': {
  				'50': '#f0fdfa',
  				'100': '#ccfbf1',
  				'200': '#99f6e4',
  				'300': '#5eead4',
  				'400': '#2dd4bf',
  				'500': '#14b8a6',
  				'600': '#0d9488',
  				'700': '#0f766e',
  				'800': '#115e59',
  				'900': '#134e4a'
  			},
  			'brand-shell': {
  				'100': '#fafaf9',
  				'200': '#f5f5f4',
  				'300': '#d6d3d1',
  				DEFAULT: '#f5f5f4'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				light: '#3B82F6',
  				dark: '#1E3A8A',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			'dark-bg': '#101214',
  			'dark-secondary': '#1d1f21',
  			'dark-tertiary': '#3b3d40',
  			'blue-primary': '#0275ff',
  			'stroke-dark': '#2d3135',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
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
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'sans-serif'
  			],
  			serif: [
  				'Merriweather',
  				'serif'
  			]
  		},
  		fontSize: {
  			'2xs': '0.625rem',
  			'3xs': '0.5rem',
  			'4xs': '0.375rem'
  		},
  		spacing: {
  			'128': '32rem',
  			'144': '36rem',
  			'160': '40rem',
  			'192': '48rem'
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
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
};

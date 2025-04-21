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
  				'300': '#fdba74'
  			},
  			'brand-coral': {
  				'300': '#e57373',
  				'400': '#ef5350',
  				'500': '#e53935'
  			},
  			'brand-stone': {
  				'700': '#44403c'
  			},
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
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
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
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  //**plugins**: Adds third-party plugins or custom plugins.
  plugins: [require("tailwindcss-animate")],
};

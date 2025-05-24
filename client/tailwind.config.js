/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // we can consider this if we have time (simple though ;) )

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
      // Dine with Locals colors -- customize but we need to keep it consistent
      // Just some examples, we will modify them as needed.
      colors: {
        'brand-orange': {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        'brand-coral': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#e57373', // lightest red
          400: '#ef5350', // medium red
          500: '#e53935', // dark red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        'brand-stone': {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        'brand-teal': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        'brand-shell': {
          DEFAULT: '#f5f5f4', // Light background for content areas
          100: '#fafaf9',
          200: '#f5f5f4',
          300: '#d6d3d1',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          light: '#3B82F6',
          dark: '#1E3A8A',
          foreground: 'hsl(var(--primary-foreground))',
        },
        'dark-bg': '#101214',
        'dark-secondary': '#1d1f21',
        'dark-tertiary': '#3b3d40',
        'blue-primary': '#0275ff',
        'stroke-dark': '#2d3135',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Inter is a popular font for web applications
        serif: ['Merriweather', 'serif'], // For headings or special text
      },
      // <p className="text-2xs">Very tiny text (10px)</p>
      fontSize: {
        '2xs': '0.625rem', // 10px
        '3xs': '0.5rem', // 8px
        '4xs': '0.375rem', // 6px
      },
      // <div className="w-128">This div is 32rem (512px) wide</div>
      spacing: {
        128: '32rem', // 512px
        144: '36rem', // 576px
        160: '40rem', // 640px
        192: '48rem', // 768px
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

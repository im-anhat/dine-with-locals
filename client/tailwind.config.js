/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // we can consider this if we have time (simple though ;) )
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Dine with Locals colors -- customize but we need to keep it consistent
      // Just some examples, we will modify them as needed.
      colors: {
        white: '#FFFFFF',
        gray: {
          dinewithlocals: '#f3f4f6',
        },
        primary: {
          DEFAULT: '#1E40AF', // blue-800
          light: '#3B82F6', // blue-500
          dark: '#1E3A8A', // blue-900
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
  plugins: [],
};

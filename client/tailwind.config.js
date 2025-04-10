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
    /*
      extend: The extend key within the theme section allows us to enhance the default theme. 
              The values specified here are merged with the existing theme values, 
              expanding the range of classes available for use. 
    */
    extend: {
      // Dine with Locals colors -- customize but we need to keep it consistent
      // Just some examples, we will modify them as needed.
      colors: {
        'brand-purple': '#C599B6',
        'brand-pink': '#E6B2BA',
        'brand-orange': '#FAD0C4',
        'brand-shell': '#FFF7F3',
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
  //**plugins**: Adds third-party plugins or custom plugins.
  plugins: [],
};

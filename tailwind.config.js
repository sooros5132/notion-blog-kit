/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        notionColor: {
          default: 'rgb(212, 212, 212)',
          gray: 'rgba(155, 155, 155, 1)',
          brown: 'rgba(186, 133, 111, 1)',
          orange: 'rgba(199, 125, 72, 1)',
          yellow: 'rgba(202, 152, 73, 1)',
          green: 'rgba(82, 158, 114, 1)',
          blue: 'rgba(94, 135, 201, 1)',
          purple: 'rgba(157, 104, 211, 1)',
          pink: 'rgba(209, 87, 150, 1)',
          red: 'rgba(223, 84, 82, 1)',
          gray_background: 'rgba(47, 47, 47, 1)',
          brown_background: 'rgba(74, 50, 40, 1)',
          orange_background: 'rgba(92, 59, 35, 1)',
          yellow_background: 'rgba(86, 67, 40, 1)',
          green_background: 'rgba(36, 61, 48, 1)',
          blue_background: 'rgba(20, 58, 78, 1)',
          purple_background: 'rgba(60, 45, 73, 1)',
          pink_background: 'rgba(78, 44, 60, 1)',
          red_background: 'rgba(82, 46, 42, 1)'
        }
      },
      backgroundColor: {
        notionColor: {
          default: 'rgb(212, 212, 212)',
          gray: 'rgba(155, 155, 155, 1)',
          brown: 'rgba(186, 133, 111, 1)',
          orange: 'rgba(199, 125, 72, 1)',
          yellow: 'rgba(202, 152, 73, 1)',
          green: 'rgba(82, 158, 114, 1)',
          blue: 'rgba(94, 135, 201, 1)',
          purple: 'rgba(157, 104, 211, 1)',
          pink: 'rgba(209, 87, 150, 1)',
          red: 'rgba(223, 84, 82, 1)',
          gray_background: 'rgba(47, 47, 47, 1)',
          brown_background: 'rgba(74, 50, 40, 1)',
          orange_background: 'rgba(92, 59, 35, 1)',
          yellow_background: 'rgba(86, 67, 40, 1)',
          green_background: 'rgba(36, 61, 48, 1)',
          blue_background: 'rgba(20, 58, 78, 1)',
          purple_background: 'rgba(60, 45, 73, 1)',
          pink_background: 'rgba(78, 44, 60, 1)',
          red_background: 'rgba(82, 46, 42, 1)'
        }
      }
    }
  },
  daisyui: {
    themes: ['light', 'dark', 'black', 'halloween']
  },
  plugins: [require('@tailwindcss/line-clamp'), require('daisyui')]
};

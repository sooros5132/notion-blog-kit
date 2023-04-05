/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '600px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    extend: {
      height: {
        'dvh-100': '100dvh'
      },
      maxHeight: {
        'dvh-100': '100dvh'
      },
      minHeight: {
        'dvh-100': '100dvh'
      },
      colors: {
        notion: {
          default: 'rgb(var(--notion-color-default) / <alpha-value>)',
          gray: 'rgb(var(--notion-color-gray) / <alpha-value>)',
          brown: 'rgb(var(--notion-color-brown) / <alpha-value>)',
          orange: 'rgb(var(--notion-color-orange) / <alpha-value>)',
          yellow: 'rgb(var(--notion-color-yellow) / <alpha-value>)',
          green: 'rgb(var(--notion-color-green) / <alpha-value>)',
          blue: 'rgb(var(--notion-color-blue) / <alpha-value>)',
          purple: 'rgb(var(--notion-color-purple) / <alpha-value>)',
          pink: 'rgb(var(--notion-color-pink) / <alpha-value>)',
          red: 'rgb(var(--notion-color-red) / <alpha-value>)',
          code: 'rgb(var(--notion-color-code) / <alpha-value>)',
          tag: {
            default: 'rgb(var(--notion-color-tag-default) / <alpha-value>)',
            gray: 'rgb(var(--notion-color-tag-gray) / <alpha-value>)',
            brown: 'rgb(var(--notion-color-tag-brown) / <alpha-value>)',
            orange: 'rgb(var(--notion-color-tag-orange) / <alpha-value>)',
            yellow: 'rgb(var(--notion-color-tag-yellow) / <alpha-value>)',
            green: 'rgb(var(--notion-color-tag-green) / <alpha-value>)',
            blue: 'rgb(var(--notion-color-tag-blue) / <alpha-value>)',
            purple: 'rgb(var(--notion-color-tag-purple) / <alpha-value>)',
            pink: 'rgb(var(--notion-color-tag-pink) / <alpha-value>)',
            red: 'rgb(var(--notion-color-tag-red) / <alpha-value>)'
          }
        }
      },
      backgroundColor: {
        notion: {
          default: 'rgb(var(--notion-color-default_background) / <alpha-value>)',
          gray: 'rgb(var(--notion-color-gray_background) / <alpha-value>)',
          brown: 'rgb(var(--notion-color-brown_background) / <alpha-value>)',
          orange: 'rgb(var(--notion-color-orange_background) / <alpha-value>)',
          yellow: 'rgb(var(--notion-color-yellow_background) / <alpha-value>)',
          green: 'rgb(var(--notion-color-green_background) / <alpha-value>)',
          blue: 'rgb(var(--notion-color-blue_background) / <alpha-value>)',
          purple: 'rgb(var(--notion-color-purple_background) / <alpha-value>)',
          pink: 'rgb(var(--notion-color-pink_background) / <alpha-value>)',
          red: 'rgb(var(--notion-color-red_background) / <alpha-value>)',
          code: 'rgb(var(--notion-color-code_background) / 0.15)',
          tag: {
            default: 'rgb(var(--notion-color-tag-default_background) / <alpha-value>)',
            gray: 'rgb(var(--notion-color-tag-gray_background) / <alpha-value>)',
            brown: 'rgb(var(--notion-color-tag-brown_background) / <alpha-value>)',
            orange: 'rgb(var(--notion-color-tag-orange_background) / <alpha-value>)',
            yellow: 'rgb(var(--notion-color-tag-yellow_background) / <alpha-value>)',
            green: 'rgb(var(--notion-color-tag-green_background) / <alpha-value>)',
            blue: 'rgb(var(--notion-color-tag-blue_background) / <alpha-value>)',
            purple: 'rgb(var(--notion-color-tag-purple_background) / <alpha-value>)',
            pink: 'rgb(var(--notion-color-tag-pink_background) / <alpha-value>)',
            red: 'rgb(var(--notion-color-tag-red_background) / <alpha-value>)'
          }
        }
      },
      fontFamily: {
        emoji: 'emoji'
      }
    }
  },
  daisyui: {
    darkTheme: 'dark',
    themes: [
      {
        light: {
          primary: '#fb923c',
          secondary: '#f472b6',
          accent: '#0891b2',
          neutral: '#e5e7eb',
          'base-100': '#f9fafb',
          info: '#3b82f6',
          success: '#34d399',
          warning: '#fde047',
          error: '#e11d48'
        }
      },
      {
        dark: {
          primary: '#fb923c',
          secondary: '#f472b6',
          accent: '#0891b2',
          neutral: '#f5f5f4',
          'base-100': '#131211',
          info: '#3b82f6',
          success: '#34d399',
          warning: '#fde047',
          error: '#e11d48'
        }
      }
    ]
  },
  plugins: [require('@tailwindcss/line-clamp'), require('daisyui')]
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        notionColor: {
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
          code: 'rgb(var(--notion-color-code) / <alpha-value>)'
        }
      },
      backgroundColor: {
        notionColor: {
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
          code: 'rgb(var(--notion-color-code_background) / 0.15)'
        }
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
          'base-100': '#f3f4f6',
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

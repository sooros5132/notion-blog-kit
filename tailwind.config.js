/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    screens: {
      sm: '600px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    container: {
      center: true,
      padding: '2rem'
    },
    extend: {
      minWidth: {
        site: 'var(--site-min-width)'
      },
      maxWidth: {
        article: 'var(--article-max-width)'
      },
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
        },
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
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        emoji: 'emoji'
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

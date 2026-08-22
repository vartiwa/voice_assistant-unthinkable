/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#FBFBFA',
          dark: '#0C0D0E',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#161719',
        },
        accent: {
          coral: '#F25C3B',
          amber: '#F59E0B',
          sage: '#10B981',
          indigo: '#4F46E5',
        },
        brand: {
          50: '#FDF8F6',
          100: '#F2E8E5',
          200: '#EADDD7',
          300: '#E0CEC7',
          400: '#D2BBB2',
          500: '#F25C3B',
          600: '#E14B2A',
          700: '#C73B1B',
          800: '#9E2C12',
          900: '#1C1917',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}

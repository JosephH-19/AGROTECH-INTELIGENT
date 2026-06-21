/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        agro: {
          primary: '#2E7D32',
          'primary-dark': '#1B5E20',
          'primary-light': '#4CAF50',
          secondary: '#1565C0',
          'secondary-dark': '#0D47A1',
          success: '#388E3C',
          warning: '#F57C00',
          danger: '#D32F2F',
          bg: '#F0F4F0',
          surface: '#FFFFFF',
          text: '#1A1A1A',
          'text-secondary': '#5A6A5A',
          border: '#DDE4DD',
          muted: '#E8EDE8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        income:  '#10b981',
        expense: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif:   ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono:    ['"Plus Jakarta Sans"', 'monospace'],
      },
      boxShadow: {
        glass:       '0 8px 32px 0 rgba(5, 150, 105, 0.1)',
        card:        '0 4px 20px rgba(0,0,0,0.08)',
        'card-hover':'0 8px 30px rgba(0,0,0,0.12)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
        'gradient-income':  'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        'gradient-expense': 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
        'gradient-dark':    'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'slide-in':   'slideIn 0.3s ease-out',
        'bounce-soft':'bounceSoft 2s infinite',
      },
      keyframes: {
        fadeIn:     { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp:    { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        slideIn:    { '0%': { transform: 'translateX(-20px)', opacity: 0 }, '100%': { transform: 'translateX(0)', opacity: 1 } },
        bounceSoft: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-5px)' } },
      },
    },
  },
  plugins: [],
};

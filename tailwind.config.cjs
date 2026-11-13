module.exports = {
  content: ['./frontend/src/**/*.{js,jsx,json}', './frontend/public/controllers/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Space Grotesk', 'sans-serif'], mono: ['IBM Plex Mono', 'monospace'] },
      colors: {
        blue: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344'
        },
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          900: '#164e63'
        }
      }
    }
  },
  plugins: []
};

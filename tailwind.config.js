/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('tailwind-rn/legacy')],
  theme: {
    extend: {
      colors: {
        // LDS/Tether brand colors
        primary: '#1E3A5F',
        'primary-light': '#3D6EA0',
        secondary: '#0F172A',
        accent: '#C49A2B',
        'accent-light': '#F59E0B',
        success: '#059669',
        danger: '#DC2626',

        // Gamification colors
        xp: '#8B5CF6',
        streak: '#F59E0B',
        gems: '#06B3EE',
        bronze: '#CD7F32',
        prata: '#C0C0C0',
        ouro: '#FFD700',
        diamante: '#10B981',
        lendario: '#FF00FF',
      },
      fontFamily: {
        sans: ['FredokaOne-Regular', 'sans-serif'],
        body: ['CrimsonPro-Regular', 'serif'],
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        surface: '#FFFFFF',
        deepGraphite: '#101828',
        aiBlue: {
          DEFAULT: '#2563EB',
          light: '#DBEAFE',
          hover: '#1D4ED8',
        },
        aiViolet: {
          DEFAULT: '#7C3AED',
          light: '#F5D0FE',
        },
        commerceTeal: {
          DEFAULT: '#14B8A6',
          light: '#CCFBF1',
        },
        lightSlate: '#E2E8F0',
        slateGrey: '#64748B',
      },
    },
  },
  plugins: [],
};

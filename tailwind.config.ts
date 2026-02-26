import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: { DEFAULT: '#0d6efd', background: colors.blue[100] },
        muted: {
          DEFAULT: colors.slate[500],
          background: colors.slate[200],
        },
      },
      backgroundColor: {
        header: '#000',
        normal: '#fff',
        inverted: '#222',
        grey: colors.slate[100],
        grey200: colors.slate[200],
        danger: colors.red[200],
      },
      textColor: {
        normal: colors.slate[800],
        inverted: '#fff',
        danger: colors.red[600],
      },
      borderColor: {
        normal: colors.slate[800],
        grey: colors.slate[200],
        danger: colors.red[500],
      },
      maxWidth: {
        largest: '1500px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;

import { extendTheme } from 'native-base'

export const THEME = extendTheme({
  colors: {
    green: {
      700: '#00875F',
      500: '#00B37E',
    },
    light: {
      700: '#333333',
      500: '#797979',
      400: '#ABA6A1',
    },
    gray: {
      700: '#121214',
      600: '#202024',
      500: '#29292E',
      400: '#323238',
      300: '#7C7C8A',
      200: '#C4C4CC',
      100: '#E1E1E6',
    },
    white: '#FFFFFF',

    red: {
      500: '#F75A68',
    },
  },
  fonts: {
    title: 'MarkPro_Bold',
    heading: 'MarkPro_Medium',
    body: 'MarkPro_Regular',
    paragraph: 'Satoshi_Regular',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
  sizes: {
    14: 56,
    22: 88,
    33: 148,
    1934: 1934,
  },
})

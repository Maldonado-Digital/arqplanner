import { extendTheme } from 'native-base'

export const THEME = extendTheme({
  colors: {
    green: {
      700: '#00875F',
      500: '#00B37E',
    },
    light: {
      700: '#333333',
      600: '#6E6A64',
      500: '#797979',
      400: '#999999',
      300: '#ABA6A1',
    },
    gray: {
      700: '#121214',
      600: '#202024',
      500: '#29292E',
      400: '#323238',
      300: '#7C7C8A',
      200: '#DEDEDE',
      100: '#E1E1E6',
    },
    white: '#FFFFFF',

    red: {
      500: '#F75A68',
      700: '#DD0000',
    },
  },
  fonts: {
    heading: 'Proxima_Nova_Semibold',
    body: 'Proxima_Nova_Regular',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  sizes: {
    11: 44,
    13: 50,
    14: 56,
    22: 88,
    28: 112,
    33: 148,
    34: 136,
    41: 164,
    1934: 1934,
  },
})

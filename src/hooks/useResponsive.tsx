import { useTheme } from 'native-base'

export function useResponsive() {
  const theme = useTheme()

  function rW(value: number) {
    return {
      base: value * 0.75,
      sm: value * 0.9,
      md: value,
      lg: value * 1.6,
    }
  }

  function rH(value: number) {
    const bH = 932

    return {
      base: value * 0.6,
      sm: value * 0.9,
      md: value,
      lg: value * 1.5,
    }
  }

  return { rW, rH }
}

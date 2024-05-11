import { Box, type IBoxProps } from 'native-base'

export function LogoBox({ children, ...rest }: IBoxProps) {
  return (
    <Box
      bg={'light.300'}
      justifyContent={'center'}
      alignItems={'center'}
      style={{
        shadowColor: '#000000',
        shadowOpacity: 0.07,
        shadowRadius: 50,
        shadowOffset: { width: 0, height: -15 },
      }}
      {...rest}
    >
      {children}
    </Box>
  )
}

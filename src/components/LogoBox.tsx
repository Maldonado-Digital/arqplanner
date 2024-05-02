import ArqWhiteTextLogoSvg from '@assets/arq_white_text_logo.svg'
import { Box, type IBoxProps } from 'native-base'
import { ms } from 'react-native-size-matters'

export function LogoBox({ ...rest }: IBoxProps) {
  return (
    <Box
      h={22}
      w={22}
      rounded={'3xl'}
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
      <ArqWhiteTextLogoSvg width={'70%'} style={{ marginRight: 3 }} />
    </Box>
  )
}

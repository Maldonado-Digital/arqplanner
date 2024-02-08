import ArqWhiteTextLogoSvg from '@assets/arq_white_text_logo.svg'
import { Box, IBoxProps } from 'native-base'

export function LogoBox({ ...rest }: IBoxProps) {
  return (
    <Box
      h={22}
      w={22}
      rounded={'3xl'}
      bg={'light.300'}
      justifyContent={'center'}
      alignItems={'center'}
      mt={-44}
      {...rest}
    >
      <ArqWhiteTextLogoSvg width={60} style={{ marginRight: 3 }} />
    </Box>
  )
}

import ArqWhiteTextLogo from '@assets/arq_white_text_logo.svg'
import BackgroundImg from '@assets/onboarding_bg.png'
import { Box, Circle, Image, VStack } from 'native-base'

export function Onboarding1() {
  return (
    <VStack flex={1} alignItems={'center'} justifyContent={'center'}>
      <Image
        source={BackgroundImg}
        defaultSource={BackgroundImg}
        alt="People training at gym"
        resizeMode="cover"
        position="absolute"
        top={-80}
        w={'full'}
        h={586}
      />

      <Circle size={1934} bg={'white'} position={'absolute'} top={466} />

      <Box
        h={21}
        w={21}
        rounded={'3xl'}
        bg={'light.400'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <ArqWhiteTextLogo width={58} style={{ marginRight: 2 }} />
      </Box>
    </VStack>
  )
}

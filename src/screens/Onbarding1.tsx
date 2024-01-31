import ArqWhiteTextLogo from '@assets/arq_white_text_logo.svg'
import BackgroundImg from '@assets/onboarding_bg.png'
import { Box, Circle, Heading, Image, Text, VStack } from 'native-base'

export function Onboarding1() {
  return (
    <VStack flex={1} alignItems={'center'}>
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

      <VStack w={'full'} h={'1/2'} mt={'auto'} alignItems={'center'} px={10}>
        <Box
          h={22}
          w={22}
          rounded={'3xl'}
          bg={'light.400'}
          justifyContent={'center'}
          alignItems={'center'}
          mt={-44}
        >
          <ArqWhiteTextLogo width={60} style={{ marginRight: 3 }} />
        </Box>

        <Heading
          fontFamily={'heading'}
          fontSize={'3xl'}
          textAlign={'center'}
          mt={10}
          color={'light.700'}
        >
          O projeto da sua casa na palma da mão.
        </Heading>

        <Text
          fontFamily={'paragraph'}
          fontSize={'md'}
          color={'light.500'}
          textAlign={'center'}
          mt={6}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          id tortor.
        </Text>
      </VStack>
    </VStack>
  )
}

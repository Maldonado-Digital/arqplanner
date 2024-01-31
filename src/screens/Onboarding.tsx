import ArqWhiteTextLogoSvg from '@assets/arq_white_text_logo.svg'
import BackgroundImg from '@assets/onboarding_bg.png'
import WhiteCircleSvg from '@assets/white_circle.svg'
import { SliderDots } from '@components/SliderDots'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Box, Heading, IconButton, Image, Text, VStack } from 'native-base'

export function Onboarding1() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleNextStep() {
    navigation.navigate('onboarding_2')
  }

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

      <WhiteCircleSvg style={{ position: 'absolute', top: 466 }} />

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
          <ArqWhiteTextLogoSvg width={60} style={{ marginRight: 3 }} />
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

        <SliderDots activeIndex={0} mt={9} />
        <IconButton
          w={22}
          h={13}
          mt={50}
          variant={'solid'}
          rounded={'full'}
          bg={'light.500'}
          onPress={handleNextStep}
          _pressed={{ bg: 'light.400' }}
          _icon={{
            size: 5,
            as: Feather,
            name: 'arrow-right',
          }}
        />
      </VStack>
    </VStack>
  )
}

export function Onboarding2() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleNextStep() {
    navigation.navigate('onboarding_3')
  }

  function handleGoBack() {
    navigation.goBack()
  }

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

      <IconButton
        alignSelf={'flex-start'}
        onPress={handleGoBack}
        mt={12}
        pt={4}
        pl={10}
        _icon={{
          as: Feather,
          name: 'arrow-left',
          color: 'white',
          size: 6,
        }}
        _pressed={{
          bg: 'transparent',
        }}
      />

      <WhiteCircleSvg style={{ position: 'absolute', top: 466 }} />

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
          <ArqWhiteTextLogoSvg width={60} style={{ marginRight: 3 }} />
        </Box>

        <Heading
          fontFamily={'heading'}
          fontSize={'3xl'}
          textAlign={'center'}
          mt={10}
          color={'light.700'}
        >
          Gerencie e aprove orçamentos.
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

        <SliderDots activeIndex={1} mt={9} />
        <IconButton
          w={22}
          h={13}
          mt={50}
          variant={'solid'}
          rounded={'full'}
          bg={'light.500'}
          onPress={handleNextStep}
          _pressed={{ bg: 'light.400' }}
          _icon={{
            size: 5,
            as: Feather,
            name: 'arrow-right',
          }}
        />
      </VStack>
    </VStack>
  )
}

export function Onboarding3() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleNextStep() {
    navigation.navigate('sign_in')
  }

  function handleGoBack() {
    navigation.goBack()
  }

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

      <IconButton
        alignSelf={'flex-start'}
        onPress={handleGoBack}
        mt={12}
        pt={4}
        pl={10}
        _icon={{
          as: Feather,
          name: 'arrow-left',
          color: 'white',
          size: 6,
        }}
        _pressed={{
          bg: 'transparent',
        }}
      />

      <WhiteCircleSvg style={{ position: 'absolute', top: 466 }} />

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
          <ArqWhiteTextLogoSvg width={60} style={{ marginRight: 3 }} />
        </Box>

        <Heading
          fontFamily={'heading'}
          fontSize={'3xl'}
          textAlign={'center'}
          mt={10}
          color={'light.700'}
        >
          Organize documentos e fotos do projeto.
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

        <SliderDots activeIndex={2} mt={9} />
        <IconButton
          w={22}
          h={13}
          mt={50}
          variant={'solid'}
          rounded={'full'}
          bg={'light.500'}
          onPress={handleNextStep}
          _pressed={{ bg: 'light.400' }}
          _icon={{
            size: 5,
            as: Feather,
            name: 'arrow-right',
          }}
        />
      </VStack>
    </VStack>
  )
}

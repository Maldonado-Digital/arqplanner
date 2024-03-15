import Mock1 from '@assets/mock-1.png'
import Mock2 from '@assets/mock-2.png'
import Mock3 from '@assets/mock-3.png'
import WhiteCircleSvg from '@assets/white_circle.svg'
import { LogoBox } from '@components/LogoBox'
import { SliderDots } from '@components/SliderDots'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Heading, IconButton, Image, Text, VStack } from 'native-base'

export function Onboarding1() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleNextStep() {
    navigation.navigate('onboarding_2')
  }

  return (
    <VStack flex={1} alignItems={'center'} bg={'gray.200'}>
      <Image
        source={Mock1}
        defaultSource={Mock1}
        alt="ArqPlanner App mock"
        resizeMode="cover"
        position="absolute"
        right={-280}
      />

      <WhiteCircleSvg style={{ position: 'absolute', top: 466 }} />

      <VStack w={'full'} h={'1/2'} mt={'auto'} alignItems={'center'} px={10}>
        <LogoBox />

        <Heading
          fontFamily={'heading'}
          fontSize={'4xl'}
          textAlign={'center'}
          mt={10}
          color={'light.700'}
        >
          Seu projeto na palma da sua mão.
        </Heading>

        <Text
          fontFamily={'body'}
          fontSize={'md'}
          color={'light.500'}
          textAlign={'center'}
          mt={6}
        >
          Tenha controle total do seu projeto onde quer que esteja.
        </Text>

        <SliderDots activeIndex={0} mt={9} />
        <IconButton
          w={24}
          h={16}
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
    <VStack flex={1} alignItems={'center'} bg={'gray.200'}>
      <Image
        source={Mock2}
        defaultSource={Mock2}
        alt="ArqPlanner App mock"
        resizeMode="cover"
        position="absolute"
        top={12}
        w={'full'}
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
          color: 'light.700',
          size: 6,
        }}
        _pressed={{
          bg: 'transparent',
        }}
      />

      <WhiteCircleSvg style={{ position: 'absolute', top: 466 }} />

      <VStack w={'full'} h={'1/2'} mt={'auto'} alignItems={'center'} px={10}>
        <LogoBox />

        <Heading
          fontFamily={'heading'}
          fontSize={'4xl'}
          textAlign={'center'}
          mt={10}
          color={'light.700'}
        >
          Gerencie e aprove projetos e imagens.
        </Heading>

        <Text
          fontFamily={'body'}
          fontSize={'md'}
          color={'light.500'}
          textAlign={'center'}
          mt={6}
        >
          Organize documentos, aprove projetos e imagens de forma descomplicada.
        </Text>

        <SliderDots activeIndex={1} mt={9} />
        <IconButton
          w={24}
          h={16}
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
    <VStack flex={1} alignItems={'center'} bg={'gray.200'}>
      <Image
        source={Mock3}
        defaultSource={Mock3}
        alt="ArqPlanner App mock"
        resizeMode="cover"
        position="absolute"
        top={16}
        w={'full'}
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
          color: 'light.700',
          size: 6,
        }}
        _pressed={{
          bg: 'transparent',
        }}
      />

      <WhiteCircleSvg style={{ position: 'absolute', top: 466 }} />

      <VStack w={'full'} h={'1/2'} mt={'auto'} alignItems={'center'} px={10}>
        <LogoBox />

        <Heading
          fontFamily={'heading'}
          fontSize={'4xl'}
          textAlign={'center'}
          mt={10}
          color={'light.700'}
        >
          Acompanhe o dia-a-dia do seu projeto.
        </Heading>

        <Text
          fontFamily={'body'}
          fontSize={'md'}
          color={'light.500'}
          textAlign={'center'}
          mt={6}
        >
          Mantenha-se atualizado com o dia-a-dia do seu projeto, em tempo real.
        </Text>

        <SliderDots activeIndex={2} mt={9} />
        <IconButton
          w={24}
          h={16}
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

import ArqWhiteTextLogoSvg from '@assets/arq_white_text_logo.svg'
import Mock1 from '@assets/mock-1.png'
import Mock2 from '@assets/mock-2.png'
import Mock3 from '@assets/mock-3.png'
import WhiteCircleSvg from '@assets/white_circle.svg'
import { LogoBox } from '@components/LogoBox'
import { SliderDots } from '@components/SliderDots'
import { Feather } from '@expo/vector-icons'
import { useResponsive } from '@hooks/useResponsive'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import {
  Box,
  Heading,
  Icon,
  IconButton,
  Image,
  Pressable,
  Text,
  VStack,
} from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ms, mvs, s, vs } from 'react-native-size-matters'

export function Onboarding1() {
  const { rW, rH } = useResponsive()
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleNextStep() {
    navigation.navigate('onboarding_2')
  }

  return (
    <VStack
      flex={1}
      alignItems={'center'}
      justifyContent={['flex-start']}
      position={'relative'}
      w={'full'}
      overflow={'hidden'}
    >
      <Image
        source={Mock1}
        defaultSource={Mock1}
        alt="ArqPlanner App mock"
        resizeMode="cover"
        position="absolute"
        w={'full'}
        h={mvs(580)}
      />

      <WhiteCircleSvg
        width={ms(1024)}
        height={s(440)}
        style={{ position: 'absolute', top: '50%' }}
      />

      <VStack w={'full'} h={'1/2'} mt={'auto'} alignItems={'center'}>
        <LogoBox
          size={rW(82)}
          marginTop={rW(-41)}
          rounded={{
            base: 22,
            sm: 24,
            md: 24,
            lg: 40,
          }}
        >
          <ArqWhiteTextLogoSvg width={'70%'} style={{ marginRight: 3 }} />
        </LogoBox>

        <VStack
          alignItems={'center'}
          justifyContent={'space-between'}
          flex={1}
          px={{
            base: 8,
            sm: 10,
            md: 10,
            lg: 10,
          }}
          pt={{
            base: 6,
            sm: 12,
            md: 12,
            lg: 16,
          }}
          pb={{
            base: 6,
            sm: 16,
            md: 16,
            lg: 20,
          }}
        >
          <Heading
            maxW={{ lg: '70%' }}
            fontFamily={'heading'}
            fontSize={{
              base: 24,
              sm: 30,
              md: 32,
              lg: 48,
            }}
            textAlign={'center'}
            color={'light.700'}
          >
            Seu projeto na palma da sua mão.
          </Heading>

          <Text
            maxW={{ lg: '60%' }}
            fontFamily={'body'}
            fontSize={{
              base: 14,
              sm: 16,
              md: 16,
              lg: 24,
            }}
            color={'light.500'}
            textAlign={'center'}
          >
            Tenha controle total do seu projeto onde quer que esteja.
          </Text>

          <SliderDots
            activeIndex={0}
            size={{
              base: 1.5,
              sm: 2,
              md: 2,
              lg: 3,
            }}
          />
          <IconButton
            w={{ base: 75, sm: 90, md: 100, lg: 148 }}
            h={{ base: 12, sm: 14, md: 16, lg: 24 }}
            variant={'solid'}
            rounded={'full'}
            bg={'light.500'}
            onPress={handleNextStep}
            _pressed={{ bg: 'light.400' }}
            _icon={{
              size: { base: 4, sm: 5, md: 5, lg: 8 },
              as: Feather,
              name: 'arrow-right',
            }}
          />
        </VStack>
      </VStack>
    </VStack>
  )
}

export function Onboarding2() {
  const { rW } = useResponsive()
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleNextStep() {
    navigation.navigate('onboarding_3')
  }

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <VStack
      flex={1}
      alignItems={'center'}
      justifyContent={['flex-start']}
      position={'relative'}
      bg={'gray.200'}
      w={'full'}
      overflow={'hidden'}
    >
      <Image
        source={Mock2}
        defaultSource={Mock2}
        alt="ArqPlanner App mock"
        resizeMode="cover"
        position="absolute"
        top={{
          base: 6,
          sm: 12,
          md: 12,
          lg: 8,
        }}
        w={'full'}
        h={{
          base: 500,
          sm: 580,
          md: 640,
          lg: 1024,
        }}
      />

      <SafeAreaView>
        <Pressable
          h={{ base: 6, sm: 6, md: 6, lg: 10 }}
          onPress={handleGoBack}
          alignSelf={'flex-start'}
          mr={'full'}
          hitSlop={20}
          ml={{
            base: 20,
            sm: 24,
            md: 24,
            lg: 48,
          }}
          mt={{
            base: 4,
            sm: 0,
            md: 0,
            lg: 8,
          }}
        >
          <Icon
            as={Feather}
            name="arrow-left"
            color={'light.700'}
            size={{ base: 6, sm: 6, md: 6, lg: 10 }}
          />
        </Pressable>
      </SafeAreaView>

      <WhiteCircleSvg
        width={ms(1024)}
        height={s(440)}
        style={{ position: 'absolute', top: '50%' }}
      />

      <VStack w={'full'} h={'1/2'} mt={'auto'} alignItems={'center'}>
        <LogoBox
          size={rW(82)}
          marginTop={rW(-41)}
          rounded={{
            base: 22,
            sm: 24,
            md: 24,
            lg: 40,
          }}
        >
          <ArqWhiteTextLogoSvg width={'70%'} style={{ marginRight: 3 }} />
        </LogoBox>

        <VStack
          alignItems={'center'}
          justifyContent={'space-between'}
          flex={1}
          px={{
            base: 8,
            sm: 10,
            md: 10,
            lg: 10,
          }}
          pt={{
            base: 6,
            sm: 12,
            md: 12,
            lg: 16,
          }}
          pb={{
            base: 6,
            sm: 16,
            md: 16,
            lg: 20,
          }}
        >
          <Heading
            maxW={{ lg: '80%' }}
            fontFamily={'heading'}
            fontSize={{
              base: 24,
              sm: 30,
              md: 32,
              lg: 48,
            }}
            textAlign={'center'}
            color={'light.700'}
          >
            Gerencie e aprove projetos e imagens.
          </Heading>

          <Text
            maxW={{ lg: '60%' }}
            fontFamily={'body'}
            fontSize={{
              base: 14,
              sm: 16,
              md: 16,
              lg: 24,
            }}
            color={'light.500'}
            textAlign={'center'}
          >
            Organize documentos, aprove projetos e imagens de forma descomplicada.
          </Text>

          <SliderDots
            activeIndex={0}
            size={{
              base: 1.5,
              sm: 2,
              md: 2,
              lg: 3,
            }}
          />
          <IconButton
            w={{ base: 75, sm: 90, md: 100, lg: 148 }}
            h={{ base: 12, sm: 14, md: 16, lg: 24 }}
            variant={'solid'}
            rounded={'full'}
            bg={'light.500'}
            onPress={handleNextStep}
            _pressed={{ bg: 'light.400' }}
            _icon={{
              size: { base: 4, sm: 5, md: 5, lg: 8 },
              as: Feather,
              name: 'arrow-right',
            }}
          />
        </VStack>
      </VStack>
    </VStack>
  )
}

export function Onboarding3() {
  const { rW } = useResponsive()
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleNextStep() {
    navigation.navigate('sign_in')
  }

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <VStack
      flex={1}
      alignItems={'center'}
      justifyContent={['flex-start']}
      position={'relative'}
      bg={'gray.200'}
      w={'full'}
      overflow={'hidden'}
    >
      <Image
        source={Mock3}
        defaultSource={Mock3}
        alt="ArqPlanner App mock"
        resizeMode="cover"
        position="absolute"
        top={{
          base: 6,
          sm: 12,
          md: 12,
          lg: 8,
        }}
        w={'full'}
        h={{
          base: 500,
          sm: 580,
          md: 640,
          lg: 1024,
        }}
      />

      <SafeAreaView>
        <Pressable
          h={{ base: 6, sm: 6, md: 6, lg: 10 }}
          onPress={handleGoBack}
          alignSelf={'flex-start'}
          mr={'full'}
          hitSlop={20}
          ml={{
            base: 20,
            sm: 24,
            md: 24,
            lg: 48,
          }}
          mt={{
            base: 4,
            sm: 0,
            md: 0,
            lg: 8,
          }}
        >
          <Icon
            as={Feather}
            name="arrow-left"
            color={'light.700'}
            size={{ base: 6, sm: 6, md: 6, lg: 10 }}
          />
        </Pressable>
      </SafeAreaView>

      <WhiteCircleSvg
        width={ms(1024)}
        height={s(440)}
        style={{ position: 'absolute', top: '50%' }}
      />

      <VStack w={'full'} h={'1/2'} mt={'auto'} alignItems={'center'}>
        <LogoBox
          size={rW(82)}
          marginTop={rW(-41)}
          rounded={{
            base: 22,
            sm: 24,
            md: 24,
            lg: 40,
          }}
        >
          <ArqWhiteTextLogoSvg width={'70%'} style={{ marginRight: 3 }} />
        </LogoBox>

        <VStack
          alignItems={'center'}
          justifyContent={'space-between'}
          flex={1}
          px={{
            base: 8,
            sm: 10,
            md: 10,
            lg: 10,
          }}
          pt={{
            base: 6,
            sm: 12,
            md: 12,
            lg: 16,
          }}
          pb={{
            base: 6,
            sm: 16,
            md: 16,
            lg: 20,
          }}
        >
          <Heading
            maxW={{ lg: '80%' }}
            fontFamily={'heading'}
            fontSize={{
              base: 24,
              sm: 30,
              md: 32,
              lg: 48,
            }}
            textAlign={'center'}
            color={'light.700'}
          >
            Acompanhe o dia-a-dia do seu projeto.
          </Heading>

          <Text
            maxW={{ lg: '60%' }}
            fontFamily={'body'}
            fontSize={{
              base: 14,
              sm: 16,
              md: 16,
              lg: 24,
            }}
            color={'light.500'}
            textAlign={'center'}
          >
            Mantenha-se atualizado com o dia-a-dia do seu projeto, em tempo real.
          </Text>

          <SliderDots
            activeIndex={0}
            size={{
              base: 1.5,
              sm: 2,
              md: 2,
              lg: 3,
            }}
          />
          <IconButton
            w={{ base: 75, sm: 90, md: 100, lg: 148 }}
            h={{ base: 12, sm: 14, md: 16, lg: 24 }}
            variant={'solid'}
            rounded={'full'}
            bg={'light.500'}
            onPress={handleNextStep}
            _pressed={{ bg: 'light.400' }}
            _icon={{
              size: { base: 4, sm: 5, md: 5, lg: 8 },
              as: Feather,
              name: 'arrow-right',
            }}
          />
        </VStack>
      </VStack>
    </VStack>
  )
}

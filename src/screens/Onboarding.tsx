import ArqWhiteTextLogoSvg from '@assets/arq_white_text_logo.svg'
import Mock1 from '@assets/mock-1.png'
import Mock2 from '@assets/mock-2.png'
import Mock3 from '@assets/mock-3.png'
import WhiteCircleSvg from '@assets/white_circle.svg'
import { LogoBox } from '@components/LogoBox'
import { SliderDots } from '@components/SliderDots'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Box, Heading, IconButton, Image, Text, VStack, View } from 'native-base'
import { ms, mvs, s, vs } from 'react-native-size-matters'

export function Onboarding1() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleNextStep() {
    navigation.navigate('onboarding_2')
  }

  return (
    // <View flex={1} bg={'gray.900'} paddingY={[0, '1/5']}>
    <VStack
      flex={1}
      alignItems={'center'}
      justifyContent={['flex-start']}
      position={'relative'}
      // marginLeft={[0, 'auto']}
      // marginRight={[0, 'auto']}
      // maxWidth={480}
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

      <VStack w={'full'} h={'1/2'} mt={'auto'} alignItems={'center'} px={[ms(36), 10]}>
        {/* <LogoBox w={mvs(70)} h={mvs(70)} mt={-44} rounded={['3xl', 32]}> */}
        <LogoBox
          size={{
            base: 70,
            sm: 76,
            md: 82,
            lg: 124,
          }}
          mt={{
            base: -35,
            sm: -38,
            md: -41,
            lg: -62,
          }}
          rounded={{
            base: 20,
            sm: 22,
            md: 24,
            lg: 36,
          }}
        >
          <ArqWhiteTextLogoSvg width={'70%'} style={{ marginRight: 3 }} />
        </LogoBox>

        <Heading
          fontFamily={'heading'}
          fontSize={[s(24), '4xl']}
          textAlign={'center'}
          mt={mvs(28)}
          color={'light.700'}
        >
          Seu projeto na palma da sua mão.
        </Heading>

        <Text
          fontFamily={'body'}
          fontSize={'md'}
          color={'light.500'}
          textAlign={'center'}
          mt={mvs(12)}
        >
          Tenha controle total do seu projeto onde quer que esteja.
        </Text>

        <SliderDots activeIndex={0} flexGrow={1} />
        <IconButton
          w={[ms(88), 24]}
          h={[mvs(54), 16]}
          mb={vs(40)}
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
    // </View>
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
    <View flex={1} bg={'gray.900'} paddingY={[0, '1/5']}>
      <VStack
        flex={1}
        alignItems={'center'}
        justifyContent={['flex-start']}
        position={'relative'}
        marginLeft={[0, 'auto']}
        marginRight={[0, 'auto']}
        bg={'gray.200'}
        maxWidth={480}
        w={'full'}
        overflow={'hidden'}
      >
        <Image
          source={Mock2}
          defaultSource={Mock2}
          alt="ArqPlanner App mock"
          resizeMode="cover"
          position="absolute"
          top={mvs(30)}
          w={'full'}
          h={mvs(500)}
        />

        <IconButton
          alignSelf={'flex-start'}
          onPress={handleGoBack}
          mt={[vs(20), 4]}
          pt={[vs(24), 4]}
          pl={[vs(24), 10]}
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

        <WhiteCircleSvg
          width={ms(1024)}
          height={vs(390)}
          style={{ position: 'absolute', top: '50%' }}
        />

        <VStack w={'full'} h={'1/2'} mt={'auto'} alignItems={'center'} px={ms(32)}>
          <LogoBox w={[s(70), 22]} h={[s(70), 22]} mt={-44} />

          <Heading
            fontFamily={'heading'}
            fontSize={[s(24), '4xl']}
            textAlign={'center'}
            mt={mvs(28)}
            color={'light.700'}
          >
            Gerencie e aprove projetos e imagens.
          </Heading>

          <Text
            fontFamily={'body'}
            fontSize={'md'}
            color={'light.500'}
            textAlign={'center'}
            mt={mvs(12)}
          >
            Organize documentos, aprove projetos e imagens de forma descomplicada.
          </Text>

          <SliderDots activeIndex={1} flexGrow={1} />
          <IconButton
            w={[ms(88), 24]}
            h={[mvs(54), 16]}
            mb={vs(40)}
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
    </View>
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
    <View flex={1} bg={'gray.900'} paddingY={[0, '1/5']}>
      <VStack
        flex={1}
        alignItems={'center'}
        justifyContent={['flex-start']}
        position={'relative'}
        marginLeft={[0, 'auto']}
        marginRight={[0, 'auto']}
        bg={'gray.200'}
        maxWidth={480}
        w={'full'}
        overflow={'hidden'}
      >
        <Image
          source={Mock3}
          defaultSource={Mock3}
          alt="ArqPlanner App mock"
          resizeMode="cover"
          position="absolute"
          top={mvs(30)}
          w={'full'}
          h={mvs(500)}
        />

        <IconButton
          alignSelf={'flex-start'}
          onPress={handleGoBack}
          mt={[vs(20), 4]}
          pt={[vs(24), 4]}
          pl={[vs(24), 10]}
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

        <WhiteCircleSvg
          width={ms(1024)}
          height={vs(390)}
          style={{ position: 'absolute', top: '50%' }}
        />

        <VStack w={'full'} h={'1/2'} mt={'auto'} alignItems={'center'} px={ms(32)}>
          <LogoBox w={[s(70), 22]} h={[s(70), 22]} mt={-44} />

          <Heading
            fontFamily={'heading'}
            fontSize={[s(24), '4xl']}
            textAlign={'center'}
            mt={mvs(28)}
            color={'light.700'}
          >
            Acompanhe o dia-a-dia do seu projeto.
          </Heading>

          <Text
            fontFamily={'body'}
            fontSize={'md'}
            color={'light.500'}
            textAlign={'center'}
            mt={mvs(12)}
          >
            Mantenha-se atualizado com o dia-a-dia do seu projeto, em tempo real.
          </Text>

          <SliderDots activeIndex={2} flexGrow={1} />
          <IconButton
            w={[ms(88), 24]}
            h={[mvs(54), 16]}
            mb={vs(40)}
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
    </View>
  )
}

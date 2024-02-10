import { ProfileHeader } from '@components/ProfileHeader'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import {
  Center,
  HStack,
  Heading,
  Icon,
  IconButton,
  Pressable,
  Text,
  VStack,
} from 'native-base'

export function Profile() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function navigateToRecoverPassword() {
    navigation.navigate('recover_password')
  }

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <VStack flex={1} bg={'gray.50'}>
      <ProfileHeader title={'Perfil'} bg={'gray.50'} />
      <VStack
        position={'relative'}
        flex={1}
        p={10}
        bg={'white'}
        borderTopRightRadius={'3xl'}
        borderTopLeftRadius={'3xl'}
        style={{
          shadowColor: '#000000',
          shadowOpacity: 0.07,
          shadowRadius: 30,
          shadowOffset: { width: 0, height: -10 },
        }}
      >
        <IconButton
          position={'absolute'}
          top={-62}
          right={10}
          w={11}
          h={11}
          variant={'outline'}
          rounded={'full'}
          bg={'white'}
          borderColor={'muted.200'}
          onPress={handleGoBack}
          _pressed={{ bg: 'muted.300' }}
          _icon={{
            size: 5,
            as: Feather,
            name: 'x',
            color: 'light.700',
          }}
        />
        <HStack w={'4/5'} alignItems={'center'} pb={8}>
          <Center
            w={24}
            h={24}
            bg={'#ABA6A133'}
            rounded={'full'}
            borderWidth={1}
            borderColor={'light.300'}
          >
            <Text fontFamily={'heading'} fontSize={'3xl'} color={'light.700'}>
              BA
            </Text>
          </Center>
          <Heading
            pl={6}
            fontFamily={'heading'}
            fontSize={'4xl'}
            color={'light.700'}
            noOfLines={2}
          >
            Bernardo {'\n'}Amim
          </Heading>
        </HStack>

        <VStack
          py={8}
          borderTopColor={'gray.200'}
          borderTopWidth={1}
          borderBottomColor={'gray.200'}
          borderBottomWidth={1}
        >
          <Heading
            fontFamily={'heading'}
            fontSize={'md'}
            color={'light.700'}
            mb={4}
          >
            Contatos
          </Heading>

          <HStack alignItems={'center'} mb={5}>
            <Icon as={Feather} name="phone" size={5} color={'light.700'} />
            <Text
              fontFamily={'body'}
              fontSize={'sm'}
              color={'light.500'}
              pl={3}
            >
              (31) 92324-2412
            </Text>
          </HStack>

          <HStack alignItems={'center'} mb={5}>
            <Icon as={Feather} name="mail" size={5} color={'light.700'} />
            <Text
              fontFamily={'body'}
              fontSize={'sm'}
              color={'light.500'}
              pl={3}
            >
              bernardo@maldonadodigital.com
            </Text>
          </HStack>

          <HStack alignItems={'center'}>
            <Icon as={Feather} name="at-sign" size={5} color={'light.700'} />
            <Text
              fontFamily={'body'}
              fontSize={'sm'}
              color={'light.500'}
              pl={3}
            >
              bernardoamim
            </Text>
          </HStack>
        </VStack>

        <VStack
          flex={1}
          pb={6}
          pt={4}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <HStack justifyContent={'center'}>
            <Text fontFamily={'body'} fontSize={'sm'} color={'light.400'}>
              Esqueceu sua senha?{' '}
            </Text>
            <Pressable onPress={navigateToRecoverPassword}>
              <Text fontFamily={'body'} fontSize={'sm'} color={'light.700'}>
                Recuperar agora.
              </Text>
            </Pressable>
          </HStack>
          <Pressable>
            <Text fontFamily={'heading'} fontSize={'sm'} color={'red.700'}>
              Sair do app agora
            </Text>
          </Pressable>
        </VStack>
      </VStack>
    </VStack>
  )
}

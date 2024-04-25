import { ProfileHeader } from '@components/ProfileHeader'
import { Toast } from '@components/Toast'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '@hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { getFullName, getInitials, phoneMask } from '@utils/helpers'
import {
  Center,
  HStack,
  Heading,
  Icon,
  IconButton,
  Text,
  VStack,
  useToast,
} from 'native-base'
import { TouchableOpacity } from 'react-native'

export function Profile() {
  const { user, signOut } = useAuth()
  const toast = useToast()
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const initials = getInitials(user.name)
  const fullName = getFullName(user.name)

  // function navigateToRecoverPassword() {
  //   navigation.navigate('recover_password')
  // }

  async function handleSignOut() {
    try {
      await signOut()
    } catch (error) {
      toast.show({
        duration: 3000,
        render: ({ id }) => (
          <Toast
            id={id}
            message={'Ocorreu um erro ao sair do app'}
            status="error"
            onClose={() => toast.close(id)}
          />
        ),
      })
    }
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
              {initials}
            </Text>
          </Center>
          <Heading
            pl={6}
            fontFamily={'heading'}
            fontSize={'4xl'}
            color={'light.700'}
            noOfLines={2}
          >
            {fullName}
          </Heading>
        </HStack>

        <VStack
          py={8}
          borderTopColor={'gray.200'}
          borderTopWidth={1}
          borderBottomColor={'gray.200'}
          borderBottomWidth={1}
        >
          <Heading fontFamily={'heading'} fontSize={'md'} color={'light.700'} mb={4}>
            Contatos
          </Heading>

          {!!user.phone_number && (
            <HStack alignItems={'center'} mb={5}>
              <Icon as={Feather} name="phone" size={5} color={'light.700'} />
              <Text fontFamily={'body'} fontSize={'sm'} color={'light.500'} pl={3}>
                {phoneMask(user.phone_number)}
              </Text>
            </HStack>
          )}

          <HStack alignItems={'center'} mb={5}>
            <Icon as={Feather} name="mail" size={5} color={'light.700'} />
            <Text fontFamily={'body'} fontSize={'sm'} color={'light.500'} pl={3}>
              {user.email}
            </Text>
          </HStack>

          {!!user.social_media && (
            <HStack alignItems={'center'}>
              <Icon as={Feather} name="at-sign" size={5} color={'light.700'} />
              <Text fontFamily={'body'} fontSize={'sm'} color={'light.500'} pl={3}>
                {user.social_media}
              </Text>
            </HStack>
          )}
        </VStack>

        <VStack
          flex={1}
          pb={6}
          pt={4}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          {/* <HStack justifyContent={'center'}>
            <Text fontFamily={'body'} fontSize={'sm'} color={'light.400'}>
              Esqueceu sua senha?{' '}
            </Text>
            <Pressable onPress={navigateToRecoverPassword}>
              <Text fontFamily={'body'} fontSize={'sm'} color={'light.700'}>
                Recuperar agora.
              </Text>
            </Pressable>
          </HStack> */}
          <TouchableOpacity onPress={handleSignOut}>
            <Text fontFamily={'heading'} fontSize={'sm'} color={'red.700'}>
              Sair do app agora
            </Text>
          </TouchableOpacity>
        </VStack>
      </VStack>
    </VStack>
  )
}

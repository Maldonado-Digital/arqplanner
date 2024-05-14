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
import { SafeAreaView } from 'react-native-safe-area-context'

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
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <VStack flex={1} bg={'gray.50'} pt={{ base: 5, sm: 5, md: 5, lg: 16 }}>
        <ProfileHeader
          title={'Perfil'}
          bg={'gray.50'}
          pb={{ base: 8, sm: 8, md: 8, lg: 16 }}
        />
        <VStack
          position={'relative'}
          flex={1}
          py={{
            base: 7,
            sm: 8,
            md: 10,
            lg: 20,
          }}
          bg={'white'}
          borderTopRightRadius={{ base: 28, sm: 28, md: 28, lg: 32 }}
          borderTopLeftRadius={{ base: 28, sm: 28, md: 28, lg: 32 }}
          style={{
            shadowColor: '#000000',
            shadowOpacity: 0.07,
            shadowRadius: 30,
            shadowOffset: { width: 0, height: -10 },
          }}
        >
          <IconButton
            position={'absolute'}
            top={{ base: -64, sm: -66, md: -68, lg: -130 }}
            right={{ base: 7, sm: 8, md: 10, lg: 16 }}
            w={{ base: 10, sm: 10, md: 11, lg: 20 }}
            h={{ base: 10, sm: 10, md: 11, lg: 20 }}
            variant={'outline'}
            rounded={'full'}
            bg={'white'}
            borderColor={'muted.200'}
            onPress={handleGoBack}
            _pressed={{ bg: 'muted.300' }}
            _icon={{
              size: { base: 5, sm: 5, md: 6, lg: 10 },
              as: Feather,
              name: 'x',
              color: 'light.700',
            }}
          />
          <HStack
            alignItems={'center'}
            pb={{
              base: 7,
              sm: 8,
              md: 10,
              lg: 16,
            }}
            px={{
              base: 7,
              sm: 8,
              md: 10,
              lg: 24,
            }}
          >
            <Center
              size={{ base: 20, sm: 22, md: 24, lg: 36 }}
              bg={'#ABA6A133'}
              rounded={'full'}
              borderWidth={1}
              borderColor={'light.300'}
            >
              <Text
                fontFamily={'heading'}
                fontSize={{
                  base: 26,
                  sm: 28,
                  md: 28,
                  lg: 44,
                }}
                color={'light.700'}
              >
                {initials}
              </Text>
            </Center>
            <Heading
              pl={{ base: 6, sm: 6, md: 6, lg: 8 }}
              fontFamily={'heading'}
              fontSize={{
                base: 24,
                sm: 30,
                md: 32,
                lg: 48,
              }}
              color={'light.700'}
              noOfLines={2}
            >
              {fullName}
            </Heading>
          </HStack>

          <VStack
            px={{
              base: 7,
              sm: 8,
              md: 10,
              lg: 24,
            }}
            py={{
              base: 5,
              sm: 6,
              md: 6,
              lg: 8,
            }}
            borderTopColor={'gray.200'}
            borderTopWidth={1}
            borderBottomColor={'gray.200'}
            borderBottomWidth={1}
          >
            <Heading
              fontFamily={'heading'}
              fontSize={{
                base: 15,
                sm: 15,
                md: 16,
                lg: 28,
              }}
              color={'light.700'}
              mb={{
                base: 4,
                sm: 5,
                md: 5,
                lg: 8,
              }}
            >
              Contatos
            </Heading>

            {!!user.phone_number && (
              <HStack
                alignItems={'center'}
                mb={{
                  base: 4,
                  sm: 5,
                  md: 5,
                  lg: 8,
                }}
              >
                <Icon
                  as={Feather}
                  name="phone"
                  size={{ base: 4, sm: 5, md: 5, lg: 8 }}
                  color={'light.700'}
                />
                <Text
                  fontFamily={'body'}
                  fontSize={{
                    base: 15,
                    sm: 15,
                    md: 16,
                    lg: 26,
                  }}
                  color={'light.500'}
                  pl={{ base: 3, sm: 3, md: 3, lg: 5 }}
                >
                  {phoneMask(user.phone_number)}
                </Text>
              </HStack>
            )}

            <HStack
              alignItems={'center'}
              mb={{
                base: 4,
                sm: 5,
                md: 5,
                lg: 8,
              }}
            >
              <Icon
                as={Feather}
                name="mail"
                size={{ base: 4, sm: 5, md: 5, lg: 8 }}
                color={'light.700'}
              />
              <Text
                fontFamily={'body'}
                fontSize={{
                  base: 15,
                  sm: 15,
                  md: 16,
                  lg: 26,
                }}
                color={'light.500'}
                pl={{ base: 3, sm: 3, md: 3, lg: 5 }}
              >
                {user.email}
              </Text>
            </HStack>

            {!!user.social_media && (
              <HStack alignItems={'center'}>
                <Icon
                  as={Feather}
                  name="at-sign"
                  size={{ base: 4, sm: 5, md: 5, lg: 8 }}
                  color={'light.700'}
                />
                <Text
                  fontFamily={'body'}
                  fontSize={{
                    base: 15,
                    sm: 15,
                    md: 16,
                    lg: 26,
                  }}
                  color={'light.500'}
                  pl={{ base: 3, sm: 3, md: 3, lg: 5 }}
                >
                  {user.social_media}
                </Text>
              </HStack>
            )}
          </VStack>

          <VStack
            flex={1}
            pb={6}
            pt={{ base: 4, sm: 4, md: 4, lg: 8 }}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            {/* <HStack justifyContent={'center'}>
            <Text fontFamily={'body'} fontSize={{
              base: 15,
              sm: 15,
              md: 16,
              lg: 24,
            }} color={'light.400'}>
              Esqueceu sua senha?{' '}
            </Text>
            <Pressable onPress={navigateToRecoverPassword}>
              <Text fontFamily={'body'} fontSize={'sm'} color={'light.700'}>
                Recuperar agora.
              </Text>
            </Pressable>
          </HStack> */}
            <TouchableOpacity onPress={handleSignOut}>
              <Text
                fontFamily={'heading'}
                fontSize={{
                  base: 15,
                  sm: 15,
                  md: 16,
                  lg: 26,
                }}
                color={'red.700'}
              >
                Sair do app agora
              </Text>
            </TouchableOpacity>
          </VStack>
        </VStack>
      </VStack>
    </SafeAreaView>
  )
}

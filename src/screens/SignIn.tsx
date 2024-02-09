import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { LogoBox } from '@components/LogoBox'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import {
  Center,
  HStack,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from 'native-base'

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleGoBack() {
    navigation.navigate('onboarding_3')
  }

  function navigateToRecoverPassword() {
    navigation.navigate('recover_password')
  }

  function handleSignIn() {
    navigation.navigate('home')
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={16}>
        <Pressable
          alignSelf={'flex-start'}
          onPress={handleGoBack}
          mt={12}
          pt={4}
          pr={4}
        >
          <Icon as={Feather} name="arrow-left" color={'light.700'} size={6} />
        </Pressable>

        <Center mt={32}>
          <LogoBox />
        </Center>

        <Heading
          mt={16}
          mb={6}
          alignSelf={'flex-start'}
          color={'light.700'}
          fontSize={'3xl'}
          fontFamily={'heading'}
        >
          Login
        </Heading>
        <Text fontSize={'md'} fontFamily={'body'} color={'light.500'} mb={8}>
          Seja bem-vindo ao ArqPlanner
        </Text>

        <Center>
          <Input
            placeholder="Insira seu email"
            keyboardType="email-address"
            autoCapitalize="none"
            mb={4}
            InputLeftElement={
              <Icon
                as={<Feather name="mail" />}
                size={4}
                ml={4}
                color="light.400"
              />
            }
          />

          <Input
            placeholder="Insira sua senha"
            secureTextEntry
            mb={4}
            InputLeftElement={
              <Icon
                as={<Feather name="lock" />}
                size={4}
                ml={4}
                color="light.400"
              />
            }
          />

          <HStack>
            <Text fontFamily={'body'} fontSize={'md'} color={'light.400'}>
              Esqueceu sua senha?{' '}
            </Text>
            <Pressable onPress={navigateToRecoverPassword}>
              <Text fontFamily={'body'} fontSize={'md'} color={'light.700'}>
                Recuperar agora.
              </Text>
            </Pressable>
          </HStack>

          <Button
            title="Entrar"
            rounded={'full'}
            fontSize={'lg'}
            mt={8}
            onPress={handleSignIn}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}

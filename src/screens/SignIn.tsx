import { Button } from '@components/Button'
import { Input } from '@components/Input'
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

        <Heading
          mt={20}
          mb={12}
          alignSelf={'flex-start'}
          color={'light.700'}
          fontSize={'3xl'}
          fontFamily={'heading'}
        >
          Faça seu login
        </Heading>

        <Center>
          <Text
            fontFamily={'label'}
            alignSelf={'flex-start'}
            fontSize={'md'}
            mb={3}
            color={'light.700'}
          >
            E-mail
          </Text>
          <Input
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            mb={6}
          />

          <Text
            fontFamily={'label'}
            alignSelf={'flex-start'}
            fontSize={'md'}
            mb={3}
            color={'light.700'}
          >
            Senha
          </Text>
          <Input placeholder="Senha" secureTextEntry mb={6} />

          <HStack>
            <Text fontFamily={'label'} fontSize={'md'} color={'light.900'}>
              Esqueceu sua senha?{' '}
            </Text>
            <Pressable onPress={navigateToRecoverPassword}>
              <Text
                fontFamily={'label'}
                fontSize={'md'}
                color={'light.600'}
                underline
              >
                Recupere aqui.
              </Text>
            </Pressable>
          </HStack>
        </Center>

        <Button
          title="Entrar"
          rounded={'full'}
          fontSize={'lg'}
          mt={'auto'}
          onPress={handleSignIn}
        />
      </VStack>
    </ScrollView>
  )
}

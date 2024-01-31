import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Center, Heading, Icon, Pressable, Text, VStack } from 'native-base'

export function RecoverPassword() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleGoBack() {
    navigation.goBack()
  }

  function handleRecoverPassword() {
    navigation.navigate('password_recovered')
  }

  return (
    <VStack flex={1} px={10} pb={16}>
      <Pressable
        alignSelf={'flex-start'}
        onPress={handleGoBack}
        bg={'red.100'}
        mt={12}
        pt={4}
        pr={4}
      >
        <Icon as={Feather} name="arrow-left" color={'light.700'} size={6} />
      </Pressable>

      <Heading
        mt={20}
        mb={6}
        alignSelf={'flex-start'}
        color={'light.700'}
        fontSize={'3xl'}
        fontFamily={'heading'}
      >
        Recupere sua senha
      </Heading>

      <Text
        fontFamily={'paragraph'}
        fontSize={'md'}
        color={'light.500'}
        mb={12}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id
        tortor.
      </Text>

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
      </Center>

      <Button
        title="Enviar instruções"
        rounded={'full'}
        fontSize={'lg'}
        mt={'auto'}
        onPress={handleRecoverPassword}
      />
    </VStack>
  )
}

export function PasswordRecovered() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function navigateToSignIn() {
    navigation.navigate('sign_in')
  }

  return (
    <VStack flex={1} px={10} pb={16} justifyContent={'center'}>
      <Center flex={1}>
        <Center
          w={20}
          h={20}
          rounded={'full'}
          borderWidth={1}
          borderColor={'gray.100'}
          bg={'gray.50'}
        >
          <Icon
            as={Feather}
            name="check-circle"
            size={8}
            color={'black'}
            strokeWidth={1}
            strokeDashoffset={0.5}
          />
        </Center>

        <Heading
          mt={4}
          mb={6}
          color={'light.700'}
          fontSize={'3xl'}
          fontFamily={'heading'}
        >
          Obrigado!
        </Heading>

        <Text
          fontFamily={'paragraph'}
          fontSize={'md'}
          color={'light.500'}
          mb={12}
          textAlign={'center'}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          id tortor.
        </Text>
      </Center>

      <Button
        title="Voltar ao login"
        rounded={'full'}
        fontSize={'lg'}
        onPress={navigateToSignIn}
      />
    </VStack>
  )
}
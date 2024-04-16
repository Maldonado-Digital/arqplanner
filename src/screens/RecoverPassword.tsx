import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Center,
  Heading,
  Icon,
  KeyboardAvoidingView,
  Pressable,
  Text,
  VStack,
  useToast,
} from 'native-base'
import { Controller, type SubmitErrorHandler, useForm } from 'react-hook-form'
import { Keyboard, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { z } from 'zod'
import { Toast } from '@components/Toast'

const recoverPasswordFormSchema = z.object({
  email: z
    .string({ required_error: 'Informe seu email' })
    .email('Formato de email inválido'),
})

export type RecoverPasswordFormData = z.infer<typeof recoverPasswordFormSchema>

export function RecoverPassword() {
  const toast = useToast()
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecoverPasswordFormData>({
    resolver: zodResolver(recoverPasswordFormSchema),
    shouldFocusError: true,
    reValidateMode: 'onBlur',
    mode: 'onSubmit',
    criteriaMode: 'all',
  })

  function handleGoBack() {
    navigation.goBack()
  }

  function navigateToPasswordRecovered() {
    navigation.navigate('password_recovered')
  }

  async function onSubmit({ email }: RecoverPasswordFormData) {
    navigateToPasswordRecovered()
  }

  const onSubmitError: SubmitErrorHandler<RecoverPasswordFormData> =
    formData => {
      Keyboard.dismiss()

      const message = formData.email?.message as string

      toast.show({
        duration: 3000,
        render: ({ id }) => (
          <Toast
            id={id}
            message={message}
            status="error"
            onClose={() => toast.close(id)}
          />
        ),
      })
    }

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: 40,
          justifyContent: 'space-between',
        }}
      >
        <Pressable alignSelf={'flex-start'} onPress={handleGoBack} w={8} h={8}>
          <Icon as={Feather} name="arrow-left" color={'light.700'} size={6} />
        </Pressable>

        <Heading
          mt={20}
          mb={6}
          alignSelf={'flex-start'}
          color={'light.700'}
          fontSize={'4xl'}
          fontFamily={'heading'}
        >
          Recupere sua senha
        </Heading>

        <Text fontFamily={'body'} fontSize={'md'} color={'light.500'} mb={12}>
          Insira seu email e enviaremos instruções para você redefinir sua senha
          de acesso.
        </Text>

        <Center>
          <Controller
            name="email"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
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
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                isInvalid={!!errors.email}
              />
            )}
          />
        </Center>

        <Button
          title="Recuperar senha"
          rounded={'full'}
          fontSize={'lg'}
          mt={'auto'}
          onPress={handleSubmit(onSubmit, onSubmitError)}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
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
        >
          <Icon
            as={Feather}
            name="check-circle"
            size={6}
            color={'black'}
            strokeWidth={1}
            strokeDashoffset={0.5}
          />
        </Center>

        <Heading
          mt={4}
          mb={6}
          color={'light.700'}
          fontSize={'4xl'}
          fontFamily={'heading'}
        >
          Obrigado!
        </Heading>

        <Text
          fontFamily={'body'}
          fontSize={'md'}
          color={'light.500'}
          mb={12}
          textAlign={'center'}
        >
          Enviamos instruções para redefinição da sua senha por e-mail.
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

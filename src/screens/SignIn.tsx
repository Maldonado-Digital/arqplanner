import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { LogoBox } from '@components/LogoBox'
import { Toast } from '@components/Toast'
import { Feather } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { AppError } from '@utils/AppError'
import {
  Center,
  HStack,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack,
  View,
  useToast,
} from 'native-base'
import { Controller, type SubmitErrorHandler, useForm } from 'react-hook-form'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { z } from 'zod'

const signInFormSchema = z.object({
  email: z
    .string({ required_error: 'Informe seu email' })
    .email('Formato de email inválido'),
  password: z
    .string({ required_error: 'Informe sua senha' })
    .min(4, { message: 'Mínimo de 4 caracteres' }),
})

export type SignInFormData = z.infer<typeof signInFormSchema>

export function SignIn() {
  const toast = useToast()
  const { signIn } = useAuth()
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    shouldFocusError: true,
    reValidateMode: 'onBlur',
    mode: 'onSubmit',
    criteriaMode: 'all',
  })

  function handleGoBack() {
    navigation.navigate('onboarding_3')
  }

  function navigateToRecoverPassword() {
    navigation.navigate('recover_password')
  }

  async function onSubmit({ email, password }: SignInFormData) {
    Keyboard.dismiss()
    try {
      await signIn(email, password)
    } catch (err) {
      const isAppError = err instanceof AppError
      const message = isAppError
        ? 'Email ou senha inválidos.'
        : 'Erro ao fazer login. Tente novamente.'

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
  }

  const onSubmitError: SubmitErrorHandler<SignInFormData> = formData => {
    Keyboard.dismiss()

    const message = (formData.email?.message || formData.password?.message) as string

    toast.show({
      duration: 3000,
      render: ({ id }) => (
        <Toast id={id} message={message} status="error" onClose={() => toast.close(id)} />
      ),
    })
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 40,
      }}
    >
      <Pressable onPress={handleGoBack} w={8} h={8} justifyContent={'flex-end'}>
        <Icon as={Feather} name="arrow-left" color={'light.700'} size={6} />
      </Pressable>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        style={{ backgroundColor: '#F00' }}
      >
        <View>
          <LogoBox alignSelf={'center'} />

          <Center>
            <Heading
              mt={8}
              mb={4}
              alignSelf={'flex-start'}
              color={'light.700'}
              fontSize={'4xl'}
              fontFamily={'heading'}
            >
              Login
            </Heading>
            <Text
              alignSelf={'flex-start'}
              fontSize={'md'}
              fontFamily={'body'}
              color={'light.500'}
              mb={6}
              fontWeight={'bold'}
            >
              Seja bem-vindo ao ArqPlanner
            </Text>
          </Center>

          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Insira seu email"
                keyboardType="email-address"
                autoCapitalize="none"
                mb={4}
                InputLeftElement={
                  <Icon as={<Feather name="mail" />} size={4} ml={4} color="light.400" />
                }
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                isInvalid={!!errors.email}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              minLength: 4,
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Insira sua senha"
                secureTextEntry
                mb={4}
                InputLeftElement={
                  <Icon as={<Feather name="lock" />} size={4} ml={4} color="light.400" />
                }
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                isInvalid={!!errors.password}
                onSubmitEditing={handleSubmit(onSubmit, onSubmitError)}
              />
            )}
          />
        </View>
      </TouchableWithoutFeedback>

      <HStack justifyContent={'center'}>
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
        mt={6}
        isLoading={isSubmitting}
        variant={'solid'}
        onPress={handleSubmit(onSubmit, onSubmitError)}
      />
    </SafeAreaView>
  )
}

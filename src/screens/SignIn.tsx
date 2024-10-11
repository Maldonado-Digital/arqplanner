import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { Toast } from '@components/Toast'
import { Feather } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@hooks/useAuth'
import { useResponsive } from '@hooks/useResponsive'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { AppError } from '@utils/AppError'
import { HStack, Icon, Pressable, Text, VStack, View, useToast } from 'native-base'
import { Controller, type SubmitErrorHandler, useForm } from 'react-hook-form'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {} from 'react-native-size-matters'
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
  const { rW, rH } = useResponsive()
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
      const message = isAppError ? err.message : 'Erro ao fazer login. Tente novamente.'

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
    <SafeAreaView style={{ flex: 1 }}>
      <VStack
        mt={{ base: 4, sm: 4, md: 0, lg: 16 }}
        px={{
          base: 7,
          sm: 8,
          md: 10,
          lg: 24,
        }}
      >
        <Pressable
          h={{ base: 6, sm: 6, md: 6, lg: 10 }}
          onPress={handleGoBack}
          alignSelf={'flex-start'}
          mr={'full'}
          hitSlop={20}
        >
          <Icon
            as={Feather}
            name="arrow-left"
            color={'light.700'}
            size={{ base: 6, sm: 6, md: 6, lg: 10 }}
          />
        </Pressable>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View>
            <Text
              mt={{ base: 8, sm: 8, md: 8, lg: 16 }}
              mb={{ base: 4, sm: 4, md: 4, lg: 10 }}
              alignSelf={'flex-start'}
              color={'light.700'}
              fontFamily={'heading'}
              fontSize={{
                base: 24,
                sm: 30,
                md: 32,
                lg: 48,
              }}
            >
              Login
            </Text>
            <Text
              alignSelf={'flex-start'}
              color={'light.500'}
              mb={{ base: 4, sm: 6, md: 6, lg: 12 }}
              fontSize={{
                base: 14,
                sm: 16,
                md: 18,
                lg: 28,
              }}
            >
              Seja bem-vindo ao ArqPlanner
            </Text>

            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Insira seu email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  mb={{ base: 4, sm: 4, md: 4, lg: 6 }}
                  InputLeftElement={
                    <Icon
                      as={<Feather name="mail" />}
                      size={{ base: 4, sm: 4, md: 4, lg: 6 }}
                      ml={{ base: 4, sm: 4, md: 4, lg: 6 }}
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
                  mb={{ base: 4, sm: 4, md: 4, lg: 6 }}
                  InputLeftElement={
                    <Icon
                      as={<Feather name="lock" />}
                      size={{ base: 4, sm: 4, md: 4, lg: 6 }}
                      ml={{ base: 4, sm: 4, md: 4, lg: 6 }}
                      color="light.400"
                    />
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
          <Text
            fontFamily={'body'}
            fontSize={{
              base: 15,
              sm: 15,
              md: 16,
              lg: 24,
            }}
            color={'light.400'}
          >
            Esqueceu sua senha?{' '}
          </Text>
          <Pressable onPress={navigateToRecoverPassword}>
            <Text
              fontFamily={'body'}
              fontSize={{
                base: 15,
                sm: 15,
                md: 16,
                lg: 24,
              }}
              color={'light.700'}
            >
              Recuperar agora.
            </Text>
          </Pressable>
        </HStack>
        <Button
          title="Entrar"
          rounded={'full'}
          fontSize={{
            base: 15,
            sm: 16,
            md: 16,
            lg: 26,
          }}
          mt={{ base: 5, sm: 6, md: 6, lg: 8 }}
          isLoading={isSubmitting}
          variant={'solid'}
          onPress={handleSubmit(onSubmit, onSubmitError)}
        />
      </VStack>
    </SafeAreaView>
  )
}

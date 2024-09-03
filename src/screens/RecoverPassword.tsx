import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { Toast } from '@components/Toast'
import { Feather } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import {
  Center,
  Icon,
  KeyboardAvoidingView,
  Pressable,
  Text,
  VStack,
  View,
  useToast,
} from 'native-base'
import { Controller, type SubmitErrorHandler, useForm } from 'react-hook-form'
import { Keyboard, Platform, TouchableWithoutFeedback } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { z } from 'zod'

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

  const onSubmitError: SubmitErrorHandler<RecoverPasswordFormData> = formData => {
    Keyboard.dismiss()

    const message = formData.email?.message as string

    toast.show({
      duration: 3000,
      render: ({ id }) => (
        <Toast id={id} message={message} status="error" onClose={() => toast.close(id)} />
      ),
    })
  }

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <VStack
          mt={{ base: 4, sm: 0, md: 0, lg: 16 }}
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
            justifyContent={'flex-start'}
            mr={'full'}
            hitSlop={20}
            bg={'blue.200'}
          >
            <Icon
              as={Feather}
              name="arrow-left"
              color={'light.700'}
              size={{ base: 6, sm: 6, md: 6, lg: 10 }}
              alignSelf={'flex-start'}
            />
          </Pressable>

          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
              <Text
                mt={{ base: 20, sm: 20, md: 20, lg: 20 }}
                mb={{ base: 6, sm: 6, md: 6, lg: 6 }}
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
                Recupere sua senha
              </Text>

              <Text
                alignSelf={'flex-start'}
                color={'light.500'}
                mb={{ base: 4, sm: 6, md: 6, lg: 12 }}
                fontWeight={'bold'}
                fontSize={{
                  base: 14,
                  sm: 16,
                  md: 18,
                  lg: 28,
                }}
              >
                Insira seu email e enviaremos instruções para você redefinir sua senha de
                acesso.
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
              </Center>
            </View>
          </TouchableWithoutFeedback>

          <Button
            title="Recuperar senha"
            rounded={'full'}
            fontSize={{
              base: 15,
              sm: 16,
              md: 16,
              lg: 26,
            }}
            mt={{ base: 4, sm: 6, md: 6, lg: 8 }}
            onPress={handleSubmit(onSubmit, onSubmitError)}
          />
        </VStack>
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
    <VStack
      flex={1}
      px={{
        base: 7,
        sm: 8,
        md: 10,
        lg: 24,
      }}
      pb={{
        base: 12,
        sm: 16,
        md: 16,
        lg: 24,
      }}
      justifyContent={'center'}
    >
      <Center flex={1}>
        <Center
          w={{ base: 20, sm: 20, md: 20, lg: 40 }}
          h={{ base: 20, sm: 20, md: 20, lg: 40 }}
          rounded={'full'}
          borderWidth={1}
          borderColor={'gray.100'}
        >
          <Icon
            as={Feather}
            name="check-circle"
            size={{ base: 6, sm: 6, md: 6, lg: 10 }}
            color={'black'}
            strokeWidth={1}
            strokeDashoffset={0.5}
          />
        </Center>

        <Text
          mt={{ base: 4, sm: 4, md: 4, lg: 8 }}
          mb={{ base: 6, sm: 6, md: 6, lg: 6 }}
          color={'light.700'}
          fontFamily={'heading'}
          fontSize={{
            base: 24,
            sm: 30,
            md: 32,
            lg: 48,
          }}
        >
          Obrigado!
        </Text>

        <Text
          fontFamily={'body'}
          color={'light.500'}
          textAlign={'center'}
          fontSize={{
            base: 14,
            sm: 16,
            md: 18,
            lg: 28,
          }}
        >
          Enviamos instruções para redefinição da sua senha por e-mail.
        </Text>
      </Center>

      <Button
        title="Voltar ao login"
        rounded={'full'}
        fontSize={{
          base: 15,
          sm: 16,
          md: 16,
          lg: 26,
        }}
        onPress={navigateToSignIn}
      />
    </VStack>
  )
}

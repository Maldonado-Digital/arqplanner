import { useAuth } from '@hooks/useAuth'
import { Center, type ICenterProps, Text } from 'native-base'
import { Pressable } from 'react-native'

export function SessionExpired({ ...rest }: ICenterProps) {
  const { signOut } = useAuth()

  return (
    <Center flex={1} {...rest}>
      <Text fontFamily={'heading'} fontSize={'xl'} mb={4} color={'light.700'}>
        Erro ao buscar as informações.
      </Text>
      <Pressable onPress={signOut}>
        <Text fontFamily={'heading'} fontSize={'md'} color={'light.500'}>
          Fazer login novamente
        </Text>
      </Pressable>
    </Center>
  )
}

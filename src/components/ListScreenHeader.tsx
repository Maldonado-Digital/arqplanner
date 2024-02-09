import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { HStack, Heading, IStackProps, Icon, Pressable } from 'native-base'

type ScreenHeaderType = IStackProps & {
  title: string
}

export function ListScreenHeader({ title, ...rest }: ScreenHeaderType) {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <HStack
      bg={'white'}
      pb={6}
      pt={16}
      px={10}
      alignItems={'flex-end'}
      justifyContent={'space-between'}
      {...rest}
    >
      <Pressable
        alignSelf={'flex-start'}
        onPress={handleGoBack}
        // mt={12}
        pt={4}
        pr={4}
      >
        <Icon as={Feather} name="arrow-left" color={'light.700'} size={6} />
      </Pressable>
      <Heading color={'light.700'} fontSize={'xl'} fontFamily={'heading'}>
        {title}
      </Heading>

      <Pressable onPress={handleGoBack}>
        <Icon as={Feather} name="more-vertical" color={'light.700'} size={6} />
      </Pressable>
    </HStack>
  )
}

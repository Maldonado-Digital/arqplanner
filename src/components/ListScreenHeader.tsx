import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import {
  HStack,
  Heading,
  IStackProps,
  Icon,
  Pressable,
  Text,
  VStack,
} from 'native-base'

type ScreenHeaderType = IStackProps & {
  title: string
  subTitle?: string
}

export function ListScreenHeader({
  title,
  subTitle,
  ...rest
}: ScreenHeaderType) {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleGoBack() {
    navigation.goBack()
  }

  function handleShowProfile() {
    navigation.navigate('profile')
  }

  return (
    <HStack
      bg={'white'}
      pb={6}
      pt={16}
      px={10}
      alignItems={'center'}
      justifyContent={'space-between'}
      {...rest}
    >
      <Pressable onPress={handleGoBack} pr={4}>
        <Icon as={Feather} name="arrow-left" color={'light.700'} size={6} />
      </Pressable>
      <VStack alignItems={'center'}>
        <Heading color={'light.700'} fontSize={'xl'} fontFamily={'heading'}>
          {title}
        </Heading>
        {!!subTitle && (
          <Text fontFamily={'body'} color={'light.500'} fontSize={'sm'}>
            {subTitle}
          </Text>
        )}
      </VStack>

      <Pressable onPress={handleShowProfile}>
        <Icon as={Feather} name="more-vertical" color={'light.700'} size={6} />
      </Pressable>
    </HStack>
  )
}

import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import {
  HStack,
  Heading,
  type IStackProps,
  Icon,
  Pressable,
  Text,
  VStack,
} from 'native-base'

type ScreenHeaderType = IStackProps & {
  title: string
  subTitle?: string
  onClickSettings: () => void
}

export function ListScreenHeader({
  title,
  subTitle,
  onClickSettings,
  ...rest
}: ScreenHeaderType) {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleGoBack() {
    navigation.goBack()
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

      <Pressable onPress={onClickSettings}>
        <Icon as={Feather} name="more-vertical" color={'light.700'} size={6} />
      </Pressable>
    </HStack>
  )
}

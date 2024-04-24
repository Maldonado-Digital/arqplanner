import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { approvalStatus, statusColor } from '@utils/constants'
import {
  Center,
  HStack,
  Heading,
  type IStackProps,
  Icon,
  Pressable,
  Text,
  VStack,
} from 'native-base'
import type { ApprovalStatus } from './ListItem'

type ScreenHeaderType = IStackProps & {
  title: string
  subTitle?: string
  status?: ApprovalStatus | null
  onClickSettings?: () => void
}

export function ListScreenHeader({
  title,
  subTitle,
  status,
  onClickSettings,
  ...rest
}: ScreenHeaderType) {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const statusText = status
    ? (approvalStatus.find(s => s.value === status)?.singular as string)
    : ''

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <HStack
      bg={'white'}
      pb={6}
      px={10}
      alignItems={'center'}
      justifyContent={'space-between'}
      {...rest}
    >
      <Pressable onPress={handleGoBack}>
        <Icon as={Feather} name="arrow-left" color={'light.700'} size={6} />
      </Pressable>
      <VStack alignItems={'center'} alignSelf={'center'}>
        <Heading color={'light.700'} fontSize={'xl'} fontFamily={'heading'}>
          {title}
        </Heading>

        {(!!status || !!subTitle) && (
          <HStack space={2} pt={1.5}>
            {!!status && (
              <Center py={1} px={2} rounded={'lg'} bg={statusColor[status]}>
                <Text fontSize={'xs'} fontFamily={'heading'} color={'light.700'}>
                  {statusText.toLocaleUpperCase()}
                </Text>
              </Center>
            )}

            {!!subTitle && (
              <Text fontFamily={'body'} color={'light.500'} fontSize={'sm'}>
                {subTitle}
              </Text>
            )}
          </HStack>
        )}
      </VStack>

      <Pressable onPress={onClickSettings}>
        <Icon as={Feather} name="more-vertical" color={'light.700'} size={6} />
      </Pressable>
    </HStack>
  )
}

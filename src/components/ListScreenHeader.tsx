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
import type { ApprovalStatus } from 'src/api/queries/getWorks'

type ScreenHeaderType = IStackProps & {
  title: string
  subTitle?: string
  status?: ApprovalStatus | null
  isMenuDisabled?: boolean
  onClickMenu?: () => void
}

export function ListScreenHeader({
  title,
  subTitle,
  status,
  onClickMenu,
  isMenuDisabled,
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
      pt={{
        base: 4,
        sm: 4,
        md: 4,
        lg: 8,
      }}
      pb={{
        base: 4,
        sm: 4,
        md: 4,
        lg: 12,
      }}
      px={{
        base: 7,
        sm: 8,
        md: 10,
        lg: 16,
      }}
      alignItems={'center'}
      justifyContent={'space-between'}
      {...rest}
    >
      <Pressable
        h={{ base: 6, sm: 6, md: 6, lg: 10 }}
        onPress={handleGoBack}
        justifyContent={'flex-start'}
        hitSlop={20}
      >
        <Icon
          as={Feather}
          name="arrow-left"
          color={'light.700'}
          size={{ base: 6, sm: 6, md: 6, lg: 10 }}
          alignSelf={'flex-start'}
        />
      </Pressable>
      <VStack alignItems={'center'} alignSelf={'center'} maxW={'3/4'}>
        <Heading
          color={'light.700'}
          fontSize={{
            base: 18,
            sm: 18,
            md: 20,
            lg: 36,
          }}
          fontFamily={'heading'}
          numberOfLines={1}
        >
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

      <Pressable
        w={{ base: 6, sm: 6, md: 6, lg: 10 }}
        onPress={onClickMenu}
        isDisabled={isMenuDisabled}
      >
        <Icon
          as={Feather}
          name="more-vertical"
          color={'light.700'}
          opacity={isMenuDisabled ? 0.2 : 1}
          size={{ base: 6, sm: 6, md: 6, lg: 10 }}
        />
      </Pressable>
    </HStack>
  )
}

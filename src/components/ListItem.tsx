import { useNavigation } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { projectStatus } from '@utils/constants'
import { Box, HStack, Heading, Text, VStack } from 'native-base'
import type { ReactNode } from 'react'
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native'

export type ItemStatus = 'pending' | 'approved' | 'archived'

type ListItemProps = TouchableOpacityProps & {
  title: string
  icon: ReactNode
  status?: ItemStatus
}

export function ListItem({ title, icon, status, ...rest }: ListItemProps) {
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const statusText = status
    ? (projectStatus.find(s => s.value === status)?.label as string)
    : ''

  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg={'white'}
        alignItems={'center'}
        justifyContent={'space-between'}
        px={10}
        py={6}
        borderTopWidth={1}
        borderTopColor={'#00000012'}
      >
        {icon}

        <VStack flex={1} ml={4} pr={4}>
          <Heading
            color={'light.700'}
            fontSize={'md'}
            fontFamily={'heading'}
            noOfLines={1}
          >
            {title}
          </Heading>

          <Text fontSize={'sm'} color={'light.500'} mt={1} numberOfLines={1}>
            13-05-23 | 05:00
          </Text>
        </VStack>

        {!!status && (
          <Box
            py={1}
            px={2}
            rounded={'xl'}
            bg={status === 'pending' ? '#F8C40E26' : '#0AAF8726'}
          >
            <Text fontSize={'xs'} fontFamily={'heading'} color={'light.700'}>
              {statusText.toLocaleUpperCase()}
            </Text>
          </Box>
        )}
      </HStack>
    </TouchableOpacity>
  )
}

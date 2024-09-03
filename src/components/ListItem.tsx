import { Feather } from '@expo/vector-icons'
import { approvalStatus, statusColor } from '@utils/constants'
import { Center, HStack, Heading, Icon, Text, VStack } from 'native-base'
import type { ReactNode } from 'react'
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native'
import type { ApprovalStatus } from 'src/api/queries/getWorks'

type ListItemProps = TouchableOpacityProps & {
  title: string
  subTitle?: string
  icon: ReactNode
  status?: ApprovalStatus
}

export function ListItem({ title, subTitle, icon, status, ...rest }: ListItemProps) {
  const statusText = status
    ? (approvalStatus.find(s => s.value === status)?.singular as string)
    : ''

  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg={'white'}
        alignItems={'center'}
        justifyContent={'space-between'}
        px={{
          base: 6,
          sm: 7,
          md: 8,
          lg: 12,
        }}
        py={{
          base: 5,
          sm: 6,
          md: 6,
          lg: 10,
        }}
        borderTopWidth={1}
        borderTopColor={'#00000012'}
      >
        {icon}

        <VStack flex={1} ml={{ base: 4, sm: 4, md: 4, lg: 6 }} pr={4}>
          <Text
            color={'light.700'}
            fontSize={{
              base: 15,
              sm: 16,
              md: 16,
              lg: 28,
            }}
            fontFamily={'heading'}
            noOfLines={1}
          >
            {title}
          </Text>

          <Text
            fontSize={{
              base: 13,
              sm: 14,
              md: 14,
              lg: 24,
            }}
            color={'light.500'}
            mt={1}
            numberOfLines={1}
          >
            {subTitle}
          </Text>
        </VStack>

        {!!status && (
          <Center
            py={{ base: 1, sm: 1, md: 1, lg: 2 }}
            px={{ base: 1.5, sm: 1.5, md: 1.5, lg: 3 }}
            rounded={{ base: 'sm', sm: 'md', md: 'lg', lg: 'md' }}
            bg={statusColor[status]}
          >
            <Text
              fontSize={{ base: 'xs', sm: 'xs', md: 'xs', lg: 'lg' }}
              fontFamily={'heading'}
              color={'light.700'}
            >
              {statusText.toLocaleUpperCase()}
            </Text>
          </Center>
        )}

        {!status && (
          <Icon
            as={Feather}
            name="chevron-right"
            size={{ base: 6, sm: 8, md: 8, lg: 12 }}
            color={'light.700'}
          />
        )}
      </HStack>
    </TouchableOpacity>
  )
}

import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Box, HStack, Heading, Text, VStack } from 'native-base'
import { ReactNode } from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

export type ItemStatus = 'pendente' | 'aprovado'

type ListItemProps = TouchableOpacityProps & {
  title: string
  icon: ReactNode
  status: ItemStatus
}

export function ListItem({ title, icon, status, ...rest }: ListItemProps) {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

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

        <Box
          py={1}
          px={2}
          rounded={'xl'}
          bg={status === 'pendente' ? '#F8C40E26' : '#0AAF8726'}
        >
          <Text fontSize={'xs'} fontFamily={'heading'} color={'light.700'}>
            {status.toLocaleUpperCase()}
          </Text>
        </Box>
      </HStack>
    </TouchableOpacity>
  )
}

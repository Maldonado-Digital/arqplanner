import { Feather } from '@expo/vector-icons'
import { Box, HStack, Heading, Icon, Text, VStack } from 'native-base'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

type EventItemProps = TouchableOpacityProps & {
  title?: string
  markerColor: string
  startTime?: string
  endTime?: string
  address?: string
}

export function EventItem({
  title = 'Visita Eletricista Márcio',
  markerColor,
  startTime = '16:30',
  endTime = '17:30',
  address = 'R. Santa Rita Durão, 759',
  ...rest
}: EventItemProps) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg={'white'}
        p={4}
        mb={3}
        alignItems={'center'}
        rounded={'lg'}
        borderWidth={1}
        borderColor={'#00000012'}
        style={{
          shadowColor: '#000000',
          shadowOpacity: 0.05,
          shadowRadius: 15,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Box w={'3px'} h={12} bg={markerColor} rounded={'full'} />
        <VStack flex={1} px={4}>
          <Heading
            color={'light.700'}
            fontSize={'md'}
            fontFamily={'heading'}
            noOfLines={1}
          >
            {title}
          </Heading>

          <Text
            fontSize={'sm'}
            color={'light.500'}
            numberOfLines={1}
            mt={'1px'}
          >
            {startTime} - {endTime} {address}
          </Text>
        </VStack>
        <Icon as={Feather} name="chevron-right" color={'light.700'} size={6} />
      </HStack>
    </TouchableOpacity>
  )
}

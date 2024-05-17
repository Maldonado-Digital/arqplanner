import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'
import { Box, HStack, Heading, Icon, Text, VStack } from 'native-base'
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native'
import type { Event } from 'src/api/queries/getWorks'

type EventItemProps = TouchableOpacityProps & {
  eventData: Event
  markerColor: string
}

export function EventItem({ eventData, markerColor, ...rest }: EventItemProps) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg={'white'}
        p={{ base: 4, sm: 4, md: 4, lg: 8 }}
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
        <Box
          w={{ base: '3px', sm: '3px', md: '3px', lg: '4px' }}
          h={'full'}
          bg={markerColor}
          rounded={'full'}
        />
        <VStack flex={1} px={4}>
          <Heading
            color={'light.700'}
            fontFamily={'heading'}
            noOfLines={1}
            fontSize={{
              base: 13,
              sm: 14,
              md: 14,
              lg: 24,
            }}
          >
            {eventData.event.title}
          </Heading>

          <Text
            fontSize={{
              base: 15,
              sm: 15,
              md: 16,
              lg: 26,
            }}
            color={'light.500'}
            numberOfLines={1}
            mt={'1px'}
          >
            {format(eventData.event.date, 'HH:mm')} – {eventData.event.address}
          </Text>
        </VStack>
        <Icon
          as={Feather}
          name="chevron-right"
          size={{ base: 6, sm: 8, md: 8, lg: 12 }}
          color={'light.700'}
        />
      </HStack>
    </TouchableOpacity>
  )
}

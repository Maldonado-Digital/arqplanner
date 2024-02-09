import { ListScreenHeader } from '@components/ListScreenHeader'
import { Box, HStack, Heading, IStackProps, VStack } from 'native-base'

type EventProps = IStackProps & {
  title: string
  markerColor: string
}

export function Event({
  title = 'Visita Eletricista Márcio',
  markerColor = '#0F25EE',
}: EventProps) {
  return (
    <VStack flex={1} bg={'gray.50'}>
      <ListScreenHeader title={'Visita técnica'} bg={'gray.50'} />
      <VStack
        flex={1}
        p={10}
        bg={'white'}
        borderTopRightRadius={'3xl'}
        borderTopLeftRadius={'3xl'}
        style={{
          shadowColor: '#000000',
          shadowOpacity: 0.07,
          shadowRadius: 30,
          shadowOffset: { width: 0, height: -10 },
        }}
      >
        <HStack w={'4/5'} alignItems={'center'}>
          <Box w={'3px'} h={'full'} bg={markerColor} rounded={'full'} />
          <Heading
            pl={5}
            fontFamily={'heading'}
            fontSize={'3xl'}
            color={'light.700'}
            noOfLines={2}
          >
            {title}
          </Heading>
        </HStack>
      </VStack>
    </VStack>
  )
}

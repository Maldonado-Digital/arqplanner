import { ListScreenHeader } from '@components/ListScreenHeader'
import { Feather } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import { Box, Center, HStack, Heading, Icon, Text, VStack } from 'native-base'

type EventRouteParams = {
  title: string
  markerColor: string
}

export function Event() {
  const route = useRoute()
  const { title, markerColor } = route.params as EventRouteParams
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
        <HStack w={'4/5'} alignItems={'center'} mb={6}>
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

        <VStack pb={6} borderBottomColor={'gray.200'} borderBottomWidth={1}>
          <Heading
            fontFamily={'heading'}
            fontSize={'md'}
            color={'light.700'}
            mb={3}
          >
            Horário e local
          </Heading>

          <HStack alignItems={'center'}>
            <Icon as={Feather} name="map-pin" size={5} color={'light.700'} />
            <Text
              fontFamily={'heading'}
              fontSize={'sm'}
              color={'light.500'}
              pl={2}
            >
              16:30 - 17:30 R. Santa Rita Durão, 759
            </Text>
          </HStack>
        </VStack>

        <VStack
          pb={6}
          pt={4}
          borderBottomColor={'gray.200'}
          borderBottomWidth={1}
        >
          <Heading
            fontFamily={'heading'}
            fontSize={'md'}
            color={'light.700'}
            mb={3}
          >
            Profissional
          </Heading>

          <HStack alignItems={'center'}>
            <Center
              w={13}
              h={13}
              bg={'#ABA6A133'}
              rounded={'full'}
              borderWidth={1}
              borderColor={'light.300'}
            >
              <Text fontFamily={'heading'} fontSize={'xl'} color={'light.700'}>
                M
              </Text>
            </Center>

            <VStack pl={2}>
              <Text fontFamily={'heading'} fontSize={'sm'} color={'light.700'}>
                Eletricista Márcio Guedes
              </Text>
              <Text fontFamily={'body'} fontSize={'sm'} color={'light.500'}>
                Eletricista Parceiro
              </Text>
            </VStack>
          </HStack>
        </VStack>

        <VStack
          pb={6}
          pt={4}
          borderBottomColor={'gray.200'}
          borderBottomWidth={1}
        >
          <Heading
            fontFamily={'heading'}
            fontSize={'md'}
            color={'light.700'}
            mb={4}
          >
            Contatos
          </Heading>

          <HStack alignItems={'center'} mb={5}>
            <Icon as={Feather} name="phone" size={5} color={'light.700'} />
            <Text
              fontFamily={'body'}
              fontSize={'sm'}
              color={'light.500'}
              pl={3}
            >
              (31) 92324-2412
            </Text>
          </HStack>

          <HStack alignItems={'center'} mb={5}>
            <Icon as={Feather} name="mail" size={5} color={'light.700'} />
            <Text
              fontFamily={'body'}
              fontSize={'sm'}
              color={'light.500'}
              pl={3}
            >
              marcioguedes@gmail.com
            </Text>
          </HStack>

          <HStack alignItems={'center'}>
            <Icon as={Feather} name="at-sign" size={5} color={'light.700'} />
            <Text
              fontFamily={'body'}
              fontSize={'sm'}
              color={'light.500'}
              pl={3}
            >
              marcioguedes
            </Text>
          </HStack>
        </VStack>

        <VStack pb={6} pt={4}>
          <Heading
            fontFamily={'heading'}
            fontSize={'md'}
            color={'light.700'}
            mb={3}
          >
            Resumo
          </Heading>

          <Text fontFamily={'body'} fontSize={'md'} color={'light.500'}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut
            libero dapibus, tristique sapien non, pharetra augue. Suspendisse
            accumsan ex eu ultricies convallis. Morbi aliquet nunc felis, quis
            lacinia nulla finibus vel. Nam nulla ex, sagittis eget fermentum
            non, elementum vitae sapien. Suspendisse consequat euismod.
          </Text>
        </VStack>
      </VStack>
    </VStack>
  )
}

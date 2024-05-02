import { ListScreenHeader } from '@components/ListScreenHeader'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useQuery } from '@tanstack/react-query'
import { phoneMask } from '@utils/helpers'
import { format } from 'date-fns'
import { Box, Center, HStack, Heading, Icon, Text, VStack } from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getWorks } from 'src/api/queries/getWorks'

type EventRouteParams = {
  id: string
  markerColor: string
}

export function Event() {
  const route = useRoute()
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const { id, markerColor } = route.params as EventRouteParams

  const {
    data: works,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
  })

  const eventData = works?.docs[0].events.find(e => e.id === id)

  const title = eventData?.event.title
  const description = eventData?.event.description
  const time = format(eventData?.event.date as string, 'HH:mm')
  const place = eventData?.event.address
  const timeAndPlace = `${time} ${place}`
  const professionalName = eventData?.event.professional_name
  const profession = eventData?.event.profession
  const phoneNumber = phoneMask(eventData?.event.contact_number || '')
  const email = eventData?.event.contact_email
  const instagram = eventData?.event.instagram

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <VStack flex={1} bg={'gray.50'}>
        <ListScreenHeader
          backgroundColor={'muted.50'}
          title={'Visita técnica'}
          onClickMenu={() => navigation.navigate('profile')}
        />
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
              fontSize={'4xl'}
              color={'light.700'}
              noOfLines={2}
            >
              {title}
            </Heading>
          </HStack>

          <VStack pb={6} borderBottomColor={'gray.200'} borderBottomWidth={1}>
            <Heading fontFamily={'heading'} fontSize={'md'} color={'light.700'} mb={3}>
              Horário e local
            </Heading>

            <HStack alignItems={'center'}>
              <Icon as={Feather} name="map-pin" size={5} color={'light.700'} />
              <Text fontFamily={'heading'} fontSize={'sm'} color={'light.500'} pl={2}>
                {timeAndPlace}
              </Text>
            </HStack>
          </VStack>

          <VStack pb={6} pt={4} borderBottomColor={'gray.200'} borderBottomWidth={1}>
            <Heading fontFamily={'heading'} fontSize={'md'} color={'light.700'} mb={3}>
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
                  {professionalName?.[0].toUpperCase()}
                </Text>
              </Center>

              <VStack pl={2}>
                <Text fontFamily={'heading'} fontSize={'sm'} color={'light.700'}>
                  {professionalName}
                </Text>
                <Text fontFamily={'body'} fontSize={'sm'} color={'light.500'}>
                  {profession}
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <VStack pb={6} pt={4} borderBottomColor={'gray.200'} borderBottomWidth={1}>
            <Heading fontFamily={'heading'} fontSize={'md'} color={'light.700'} mb={4}>
              Contatos
            </Heading>

            {!!phoneNumber && (
              <HStack alignItems={'center'} mb={5}>
                <Icon as={Feather} name="phone" size={5} color={'light.700'} />
                <Text fontFamily={'body'} fontSize={'sm'} color={'light.500'} pl={3}>
                  {phoneNumber}
                </Text>
              </HStack>
            )}

            {!!email && (
              <HStack alignItems={'center'} mb={5}>
                <Icon as={Feather} name="mail" size={5} color={'light.700'} />
                <Text fontFamily={'body'} fontSize={'sm'} color={'light.500'} pl={3}>
                  {email}
                </Text>
              </HStack>
            )}

            {!!instagram && (
              <HStack alignItems={'center'}>
                <Icon as={Feather} name="at-sign" size={5} color={'light.700'} />
                <Text fontFamily={'body'} fontSize={'sm'} color={'light.500'} pl={3}>
                  {instagram}
                </Text>
              </HStack>
            )}
          </VStack>

          <VStack pb={6} pt={4}>
            <Heading fontFamily={'heading'} fontSize={'md'} color={'light.700'} mb={3}>
              Resumo
            </Heading>

            <Text fontFamily={'body'} fontSize={'md'} color={'light.500'}>
              {description}
            </Text>
          </VStack>
        </VStack>
      </VStack>
    </SafeAreaView>
  )
}

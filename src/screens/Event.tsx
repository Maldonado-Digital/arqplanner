import { ListScreenHeader } from '@components/ListScreenHeader'
import { SessionExpired } from '@components/SessionExpired'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useQuery } from '@tanstack/react-query'
import { phoneMask } from '@utils/helpers'
import { format } from 'date-fns'
import { Box, Center, HStack, Icon, Text, VStack } from 'native-base'
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
    isError,
    isPending,
  } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
    retry: false,
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

  if (isError) return <SessionExpired />

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <VStack flex={1} bg={'gray.50'} pt={{ base: 4, sm: 4, md: 4, lg: 8 }}>
        <ListScreenHeader
          backgroundColor={'muted.50'}
          title={title || 'Detalhes do Compromisso'}
          onClickMenu={() => navigation.navigate('profile')}
        />
        <VStack
          flex={1}
          py={{
            base: 7,
            sm: 8,
            md: 10,
            lg: 20,
          }}
          px={{
            base: 7,
            sm: 8,
            md: 10,
            lg: 16,
          }}
          bg={'white'}
          borderTopRightRadius={{ base: 28, sm: 28, md: 28, lg: 32 }}
          borderTopLeftRadius={{ base: 28, sm: 28, md: 28, lg: 32 }}
          style={{
            shadowColor: '#000000',
            shadowOpacity: 0.07,
            shadowRadius: 30,
            shadowOffset: { width: 0, height: -10 },
          }}
        >
          <HStack
            pb={{
              base: 7,
              sm: 8,
              md: 10,
              lg: 16,
            }}
          >
            <Box
              w={{ base: '3px', sm: '3px', md: '3px', lg: '5px' }}
              h={'full'}
              bg={markerColor}
              rounded={'full'}
            />
            <Text
              pl={{ base: 6, sm: 6, md: 6, lg: 8 }}
              fontFamily={'heading'}
              fontSize={{
                base: 24,
                sm: 30,
                md: 32,
                lg: 48,
              }}
              color={'light.700'}
              noOfLines={2}
            >
              {title}
            </Text>
          </HStack>

          <VStack
            pb={{
              base: 5,
              sm: 6,
              md: 6,
              lg: 8,
            }}
            borderBottomColor={'gray.200'}
            borderBottomWidth={1}
          >
            <Text
              fontFamily={'heading'}
              fontSize={{
                base: 15,
                sm: 15,
                md: 16,
                lg: 28,
              }}
              color={'light.700'}
              mb={{
                base: 3,
                sm: 3,
                md: 3,
                lg: 4,
              }}
            >
              Horário e local
            </Text>

            <HStack alignItems={'center'}>
              <Icon
                as={Feather}
                name="map-pin"
                size={{ base: 4, sm: 5, md: 5, lg: 8 }}
                color={'light.700'}
              />
              <Text
                fontFamily={'heading'}
                fontSize={{
                  base: 15,
                  sm: 15,
                  md: 16,
                  lg: 26,
                }}
                color={'light.500'}
                pl={2}
              >
                {timeAndPlace}
              </Text>
            </HStack>
          </VStack>

          <VStack
            pb={{
              base: 5,
              sm: 6,
              md: 6,
              lg: 8,
            }}
            pt={{
              base: 4,
              sm: 4,
              md: 4,
              lg: 8,
            }}
            borderBottomColor={'gray.200'}
            borderBottomWidth={1}
          >
            <Text
              fontFamily={'heading'}
              fontSize={{
                base: 15,
                sm: 15,
                md: 16,
                lg: 26,
              }}
              color={'light.700'}
              mb={{
                base: 3,
                sm: 3,
                md: 3,
                lg: 4,
              }}
            >
              Profissional
            </Text>

            <HStack alignItems={'center'}>
              <Center
                size={{ base: 13, sm: 14, md: 14, lg: 20 }}
                bg={'#ABA6A133'}
                rounded={'full'}
                borderWidth={1}
                borderColor={'light.300'}
              >
                <Text
                  fontFamily={'heading'}
                  fontSize={{
                    base: 20,
                    sm: 24,
                    md: 24,
                    lg: 36,
                  }}
                  color={'light.700'}
                >
                  {professionalName?.[0].toUpperCase()}
                </Text>
              </Center>

              <VStack
                pl={{
                  base: 3,
                  sm: 3,
                  md: 3,
                  lg: 4,
                }}
              >
                <Text
                  fontFamily={'heading'}
                  fontSize={{
                    base: 14,
                    sm: 14,
                    md: 14,
                    lg: 24,
                  }}
                  color={'light.700'}
                >
                  {professionalName}
                </Text>
                <Text
                  fontFamily={'body'}
                  fontSize={{
                    base: 14,
                    sm: 14,
                    md: 14,
                    lg: 24,
                  }}
                  color={'light.500'}
                >
                  {profession}
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <VStack
            pb={{ base: 1, sm: 2, md: 2, lg: 2 }}
            pt={{ base: 4, sm: 4, md: 4, lg: 8 }}
            borderBottomColor={'gray.200'}
            borderBottomWidth={1}
          >
            <Text
              fontFamily={'heading'}
              fontSize={{
                base: 15,
                sm: 15,
                md: 16,
                lg: 26,
              }}
              color={'light.700'}
              mb={{
                base: 4,
                sm: 5,
                md: 5,
                lg: 8,
              }}
            >
              Contatos
            </Text>

            {!!phoneNumber && (
              <HStack
                alignItems={'center'}
                mb={{
                  base: 4,
                  sm: 5,
                  md: 5,
                  lg: 8,
                }}
              >
                <Icon
                  as={Feather}
                  name="phone"
                  size={{ base: 4, sm: 5, md: 5, lg: 8 }}
                  color={'light.700'}
                />
                <Text
                  fontFamily={'body'}
                  fontSize={{
                    base: 15,
                    sm: 15,
                    md: 16,
                    lg: 26,
                  }}
                  color={'light.500'}
                  pl={{ base: 3, sm: 3, md: 3, lg: 5 }}
                >
                  {phoneNumber}
                </Text>
              </HStack>
            )}

            {!!email && (
              <HStack alignItems={'center'} mb={5}>
                <Icon as={Feather} name="mail" size={5} color={'light.700'} />
                <Text
                  fontFamily={'body'}
                  fontSize={{
                    base: 15,
                    sm: 15,
                    md: 16,
                    lg: 26,
                  }}
                  color={'light.500'}
                  pl={{ base: 3, sm: 3, md: 3, lg: 5 }}
                >
                  {email}
                </Text>
              </HStack>
            )}

            {!!instagram && (
              <HStack alignItems={'center'}>
                <Icon as={Feather} name="at-sign" size={5} color={'light.700'} />
                <Text
                  fontFamily={'body'}
                  fontSize={{
                    base: 15,
                    sm: 15,
                    md: 16,
                    lg: 26,
                  }}
                  color={'light.500'}
                  pl={{ base: 3, sm: 3, md: 3, lg: 5 }}
                >
                  {instagram}
                </Text>
              </HStack>
            )}
          </VStack>

          <VStack
            pb={{ base: 1, sm: 2, md: 2, lg: 2 }}
            pt={{ base: 4, sm: 4, md: 4, lg: 8 }}
          >
            <Text
              fontFamily={'heading'}
              fontSize={{
                base: 15,
                sm: 15,
                md: 16,
                lg: 26,
              }}
              color={'light.700'}
              mb={3}
            >
              Resumo
            </Text>

            <Text
              fontFamily={'body'}
              fontSize={{
                base: 15,
                sm: 15,
                md: 16,
                lg: 26,
              }}
              color={'light.500'}
            >
              {description}
            </Text>
          </VStack>
        </VStack>
      </VStack>
    </SafeAreaView>
  )
}

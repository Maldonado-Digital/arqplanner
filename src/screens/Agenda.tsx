import { Calendar } from '@components/Calendar'
import { EventItem } from '@components/EventItem'
import { ListEmpty } from '@components/ListEmpty'
import { Loading } from '@components/Loading'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '@hooks/useAuth'
import { useRefresh } from '@hooks/useRefresh'
import { useNavigation } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useQuery } from '@tanstack/react-query'
import { calendarEventColors } from '@utils/constants'
import { format, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import {
  Center,
  FlatList,
  HStack,
  Heading,
  Icon,
  Pressable,
  Text,
  VStack,
} from 'native-base'
import { useState } from 'react'
import type { MarkedDates } from 'react-native-calendars/src/types'
import { getWorks } from 'src/api/queries/getWorks'

export function Agenda() {
  const { signOut } = useAuth()
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const today = new Date().toISOString()

  const [selectedDate, setSelectedDate] = useState(today)
  const formattedDate = format(selectedDate, 'yyyy-MM-dd')
  const selectedDateText = format(selectedDate, "dd' de 'MMMM", {
    locale: ptBR,
  })

  const {
    data: works,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
  })

  const displayedEvents = works?.docs[0].events?.filter(day => {
    return isSameDay(selectedDate, day.event.date)
  })

  const markedDates: MarkedDates = {}

  works?.docs[0].events?.forEach(({ event, id }, index) => {
    const eventDate = event.date.split('T')[0]

    if (!markedDates[eventDate]) {
      markedDates[eventDate] = {
        selected: formattedDate === eventDate,
        dots: [
          {
            key: id,
            color:
              calendarEventColors[index] ||
              calendarEventColors[index - calendarEventColors.length],
          },
        ],
      }

      return
    }

    if (markedDates[eventDate]?.dots) {
      markedDates[eventDate].dots?.push({
        key: id,
        color:
          calendarEventColors[index] ||
          calendarEventColors[index - calendarEventColors.length],
      })
    }
  })

  function handleSelectedDateChange(date: string) {
    const dateWithTime = new Date(`${date}T12:00:00`).toISOString()
    setSelectedDate(dateWithTime)
  }

  function handleGoBack() {
    navigation.goBack()
  }

  function navigateToEvent(id: string, markerColor: string) {
    navigation.navigate('event', { id, markerColor })
  }

  if (isLoading) return <Loading />

  if (error) {
    return (
      <Center flex={1}>
        <Text fontFamily={'heading'} fontSize={'xl'} mb={4} color={'light.700'}>
          Erro ao buscar as informações.
        </Text>
        <Pressable onPress={signOut}>
          <Text fontFamily={'heading'} fontSize={'md'} color={'light.500'}>
            Fazer login novamente
          </Text>
        </Pressable>
      </Center>
    )
  }

  return (
    <VStack flex={1} bg={'gray.50'}>
      <VStack
        pt={16}
        px={10}
        pb={6}
        mb={8}
        bg={'white'}
        borderWidth={1}
        borderColor={'#00000012'}
        borderBottomRightRadius={'3xl'}
        borderBottomLeftRadius={'3xl'}
        style={{
          shadowColor: '#000000',
          shadowOpacity: 0.05,
          shadowRadius: 30,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Pressable alignSelf={'flex-start'} onPress={handleGoBack} mb={6}>
          <Icon as={Feather} name="arrow-left" color={'light.700'} size={6} />
        </Pressable>
        <HStack w={'full'} mb={6} alignItems={'center'} justifyContent={'space-between'}>
          <Heading fontFamily={'heading'} fontSize={'4xl'}>
            Agenda
          </Heading>

          <Pressable>
            <Icon as={Feather} name="more-vertical" color={'light.700'} size={6} />
          </Pressable>
        </HStack>

        <Calendar
          selected={formattedDate}
          onSelect={handleSelectedDateChange}
          initialDate={formattedDate}
          markedDates={markedDates}
        />
      </VStack>

      <VStack flex={1}>
        <Heading fontFamily={'heading'} color={'light.700'} fontSize={'md'} px={10}>
          {selectedDateText}
        </Heading>

        <FlatList
          px={10}
          data={displayedEvents}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <EventItem
              title={item.event.title}
              markerColor={
                calendarEventColors[index] ||
                calendarEventColors[index - calendarEventColors.length]
              }
              onPress={() =>
                navigateToEvent(
                  item.id,
                  calendarEventColors[index] ||
                    calendarEventColors[index - calendarEventColors.length],
                )
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 20, mt: 6 }}
          ListEmptyComponent={() => (
            <ListEmpty
              icon="calendar"
              title="Nenhum evento na data selecionada"
              message="Você não possui nenhum evento na data selecionada."
            />
          )}
        />
      </VStack>
    </VStack>
  )
}

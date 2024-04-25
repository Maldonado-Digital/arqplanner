import { Calendar } from '@components/Calendar'
import { EventItem } from '@components/EventItem'
import { ListEmpty } from '@components/ListEmpty'
import { Loading } from '@components/Loading'
import { SessionExpired } from '@components/SessionExpired'
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
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const today = new Date().toISOString()

  const [selectedDate, setSelectedDate] = useState(today)
  const showTodayText = isSameDay(today, selectedDate)
  const formattedDate = format(selectedDate, 'yyyy-MM-dd')
  const selectedDateText = format(selectedDate, "dd' de 'MMMM", {
    locale: ptBR,
  })

  const {
    data: works,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
    retry: false,
  })

  const markedDates: MarkedDates = {
    [formattedDate]: { selected: true, disableTouchEvent: true },
  }

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
    } else {
      markedDates[eventDate].dots = [
        {
          key: id,
          color:
            calendarEventColors[index] ||
            calendarEventColors[index - calendarEventColors.length],
        },
      ]
    }
  })

  const displayedEvents = works?.docs[0].events?.filter(day => {
    return isSameDay(selectedDate, day.event.date)
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

  if (isPending) return <Loading />

  if (isError) return <SessionExpired />

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
        <HStack w={'full'} mb={6} alignItems={'center'}>
          <Heading fontFamily={'heading'} fontSize={'4xl'}>
            Agenda
          </Heading>
        </HStack>

        <Calendar
          selected={formattedDate}
          onSelect={handleSelectedDateChange}
          initialDate={formattedDate}
          markedDates={markedDates}
        />
      </VStack>

      <VStack flex={1}>
        <HStack px={10} mb={5} alignItems={'center'} space={2} h={6}>
          <Heading fontFamily={'heading'} color={'light.700'} fontSize={'md'}>
            {selectedDateText}
          </Heading>
          {showTodayText && (
            <Text fontFamily={'body'} color={'light.500'} fontSize={'md'}>
              (Hoje)
            </Text>
          )}
        </HStack>

        <FlatList
          px={10}
          data={displayedEvents}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => {
            const markerColor =
              markedDates[selectedDate.split('T')[0]].dots?.find(
                dot => dot.key === item.id,
              )?.color ||
              calendarEventColors[index] ||
              calendarEventColors[index - calendarEventColors.length]
            return (
              <EventItem
                eventData={item}
                markerColor={markerColor}
                onPress={() => navigateToEvent(item.id, markerColor)}
              />
            )
          }}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 10 }}
          ListEmptyComponent={() => (
            <ListEmpty
              pt={5}
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

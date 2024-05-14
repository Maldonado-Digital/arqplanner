import { Calendar } from '@components/Calendar'
import { EventItem } from '@components/EventItem'
import { ListEmpty } from '@components/ListEmpty'
import { Loading } from '@components/Loading'
import { SessionExpired } from '@components/SessionExpired'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useQuery } from '@tanstack/react-query'
import { calendarEventColors } from '@utils/constants'
import { format, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { FlatList, HStack, Heading, Icon, Pressable, Text, VStack } from 'native-base'
import { useState } from 'react'
import type { MarkedDates } from 'react-native-calendars/src/types'
import { SafeAreaView } from 'react-native-safe-area-context'
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

  if (!isPending && isError) return <SessionExpired />

  return (
    <VStack flex={1} bg={'gray.50'}>
      <VStack
        pt={{ base: 4, sm: 0, md: 0, lg: 16 }}
        px={{
          base: 7,
          sm: 8,
          md: 10,
          lg: 16,
        }}
        pb={{
          base: 4,
          sm: 0,
          md: 0,
          lg: 6,
        }}
        mb={{
          base: 6,
          sm: 8,
          md: 8,
          lg: 16,
        }}
        bg={'white'}
        borderWidth={1}
        borderColor={'#00000012'}
        borderBottomRightRadius={{
          base: 28,
          sm: 28,
          md: 28,
          lg: 36,
        }}
        borderBottomLeftRadius={{
          base: 28,
          sm: 28,
          md: 28,
          lg: 36,
        }}
        style={{
          shadowColor: '#000000',
          shadowOpacity: 0.05,
          shadowRadius: 30,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <SafeAreaView>
          <Pressable
            h={{ base: 6, sm: 6, md: 6, lg: 10 }}
            onPress={handleGoBack}
            justifyContent={'flex-start'}
            mr={'full'}
            hitSlop={20}
          >
            <Icon
              as={Feather}
              name="arrow-left"
              color={'light.700'}
              size={{ base: 6, sm: 6, md: 6, lg: 10 }}
              alignSelf={'flex-start'}
            />
          </Pressable>
          <Heading
            fontFamily={'heading'}
            fontSize={{
              base: 24,
              sm: 30,
              md: 32,
              lg: 48,
            }}
            w={'full'}
            mt={{ base: 5, sm: 6, md: 6, lg: 12 }}
            mb={{ base: 5, sm: 6, md: 6, lg: 10 }}
            alignItems={'center'}
          >
            Agenda
          </Heading>

          <Calendar
            selected={formattedDate}
            onSelect={handleSelectedDateChange}
            initialDate={formattedDate}
            markedDates={markedDates}
          />
        </SafeAreaView>
      </VStack>

      <VStack flex={1}>
        <HStack
          px={{
            base: 7,
            sm: 8,
            md: 10,
            lg: 24,
          }}
          mb={5}
          alignItems={'center'}
          space={2}
          h={{ base: 6, sm: 6, md: 6, lg: 10 }}
        >
          <Heading
            fontFamily={'heading'}
            color={'light.700'}
            fontSize={{
              base: 15,
              sm: 15,
              md: 16,
              lg: 28,
            }}
          >
            {selectedDateText}
          </Heading>
          {showTodayText && (
            <Text
              fontFamily={'body'}
              color={'light.500'}
              fontSize={{
                base: 15,
                sm: 15,
                md: 16,
                lg: 28,
              }}
            >
              (Hoje)
            </Text>
          )}
        </HStack>

        <FlatList
          px={{
            base: 7,
            sm: 8,
            md: 10,
            lg: 24,
          }}
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
              pt={{
                base: 3,
                sm: 4,
                md: 5,
                lg: 24,
              }}
              maxW={'90%'}
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

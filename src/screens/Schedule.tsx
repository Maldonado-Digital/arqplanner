import { Calendar } from '@components/Calendar'
import { EventItem } from '@components/EventItem'
import { ListEmpty } from '@components/ListEmpty'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { FlatList, HStack, Heading, Icon, Pressable, VStack } from 'native-base'
import { useState } from 'react'

export function Schedule() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const today = new Date()
  const [events, setEvents] = useState(['#0F25EE', '#F8C40E', '#FF38A4'])
  const [selectedDate, setSelectedDate] = useState(today)
  const formattedDate = `${selectedDate.getDate()} de ${Intl.DateTimeFormat(
    'pt-BR',
    { month: 'long' },
  ).format(selectedDate)}`

  function handleGoBack() {
    navigation.goBack()
  }

  function navigateToEvent(markerColor: string) {
    navigation.navigate('event', {
      title: 'Visita Eletricista Márcio',
      markerColor,
    })
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
        <HStack
          w={'full'}
          mb={6}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Heading fontFamily={'heading'} fontSize={'4xl'}>
            Agenda
          </Heading>

          <Pressable onPress={handleGoBack}>
            <Icon
              as={Feather}
              name="more-vertical"
              color={'light.700'}
              size={6}
            />
          </Pressable>
        </HStack>

        <Calendar
          selected={selectedDate.toISOString().split('T')[0]}
          onSelect={day => setSelectedDate(new Date(day))}
        />
      </VStack>

      <VStack flex={1}>
        <Heading
          fontFamily={'heading'}
          color={'light.700'}
          fontSize={'md'}
          px={10}
        >
          {formattedDate}
        </Heading>

        <FlatList
          px={10}
          data={events}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <EventItem
              markerColor={`${item}`}
              onPress={() => navigateToEvent(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 20, mt: 6 }}
          ListEmptyComponent={() => (
            <ListEmpty
              mt={8}
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

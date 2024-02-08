import { Category } from '@components/Category'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { FlatList, VStack } from 'native-base'
import { useState } from 'react'

export function Documents() {
  const [groups, setGroups] = useState(['costas', 'biceps', 'triceps', 'ombro'])
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [exercises, setExercises] = useState([
    'Todos',
    'Propostas',
    'Briefings',
    'Contratos',
  ])

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails() {
    // navigation.navigate('exercise')
  }

  return (
    <VStack flex={1} bg={'gray.50'} pb={20}>
      <ListScreenHeader title="Documentos" />

      <FlatList
        data={exercises}
        keyExtractor={item => item}
        horizontal
        renderItem={({ item }) => (
          <Category
            name={item}
            isActive={
              selectedCategory.toLocaleUpperCase() === item.toLocaleUpperCase()
            }
            onPress={() => setSelectedCategory(item)}
            onTouchStart={() => setSelectedCategory('')}
          />
        )}
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 6 }}
        maxH={10}
        minH={10}
        bg={'white'}
        borderBottomWidth={1}
        borderBottomColor={'#00000012'}
      />

      <VStack flex={1} px={8}>
        {/* <FlatList
          data={exercises}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <ExerciseCard onPress={handleOpenExerciseDetails} />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 20 }}
        /> */}
      </VStack>
    </VStack>
  )
}

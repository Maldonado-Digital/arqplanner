import { Category } from '@components/Category'
import { ListEmpty } from '@components/ListEmpty'
import { ItemStatus, ListItem } from '@components/ListItem'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { FlatList, Icon, VStack } from 'native-base'
import { useState } from 'react'

export function Documents() {
  const [documents, setDocuments] = useState([
    'Orçamento Quarto-1 v1',
    'Orçamento Quarto-1 v2',
    'Orçamento Sala v1',
    'Orçamento Sala v2',
    'Contrato',
    'Proposta Cozinha v1',
    'Proposta Cozinha v2',
    'Briefing v1',
    'Briefing v2',
    'Briefing v3',
  ])
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [categories, setCategories] = useState([
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
    <VStack flex={1} bg={'gray.50'}>
      <ListScreenHeader title="Documentos" bg={'white'} opacity={90} />

      <FlatList
        data={categories}
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

      <FlatList
        mt={6}
        flex={1}
        data={documents}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <ListItem
            title={item}
            status={
              ['pendente', 'aprovado'].at(
                Math.round(Math.random()),
              ) as ItemStatus
            }
            icon={<Icon as={Feather} name="folder" size={6} color="#A9772C" />}
            onPress={handleOpenExerciseDetails}
          />
        )}
        showsVerticalScrollIndicator={false}
        _contentContainerStyle={{
          paddingBottom: 20,
          flex: 1,
          justifyContent: 'center',
        }}
        ListEmptyComponent={() => (
          <ListEmpty
            flex={1}
            px={10}
            icon="folder"
            title="Nenhum documento foi encontrado"
            message="Você ainda não possui nenhum documento adicionado."
          />
        )}
      />
    </VStack>
  )
}

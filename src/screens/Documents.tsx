import { Category } from '@components/Category'
import { ListEmpty } from '@components/ListEmpty'
import { ListItem } from '@components/ListItem'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Loading } from '@components/Loading'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useQuery } from '@tanstack/react-query'
import { documentsCategories } from '@utils/constants'
import { format } from 'date-fns'
import { FlatList, Icon, VStack } from 'native-base'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { type Document, getWorks } from 'src/api/queries/getWorks'

export function Documents() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const {
    data: works,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
  })

  const documents = works?.docs[0].documents
  const filteredDocuments = documents?.filter(
    document => document.document.type === selectedCategory || selectedCategory === 'all',
  )
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleViewDocument(document: Document) {
    navigation.navigate('document_view', {
      documentId: document.id,
      documentType: 'document',
    })
  }

  if (isLoading) return <Loading />

  if (error) return null

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <VStack flex={1} bg={'gray.50'}>
        <ListScreenHeader
          title={'Documentos'}
          onClickMenu={() => navigation.navigate('profile')}
        />

        <FlatList
          data={documentsCategories}
          keyExtractor={item => item.value}
          horizontal
          renderItem={({ item }) => (
            <Category
              name={item.label}
              isActive={
                selectedCategory.toLocaleLowerCase() === item.value.toLocaleLowerCase()
              }
              onPress={() => setSelectedCategory(item.value)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          _contentContainerStyle={{ px: 6 }}
          maxH={10}
          minH={10}
          bg={'white'}
          borderBottomWidth={1}
          borderBottomColor={'#00000012'}
          mb={6}
        />

        <FlatList
          data={filteredDocuments}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ListItem
              title={item.document.title}
              subTitle={format(item.document.file.updatedAt, "dd-MM-yy' | 'HH:mm")}
              icon={<Icon as={Feather} name="folder" size={6} color="light.700" />}
              onPress={() => handleViewDocument(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            paddingBottom: 20,
            ...(!documents?.length && { flex: 1, justifyContent: 'center' }),
          }}
          ListEmptyComponent={() => (
            <ListEmpty
              px={10}
              icon="folder"
              title="Nenhum documento foi encontrado"
              message="Você ainda não possui nenhum documento adicionado."
            />
          )}
        />
      </VStack>
    </SafeAreaView>
  )
}

import { Category } from '@components/Category'
import { ListEmpty } from '@components/ListEmpty'
import { type ItemStatus, ListItem } from '@components/ListItem'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useQuery } from '@tanstack/react-query'
import { projectStatus } from '@utils/constants'
import { FlatList, Icon, VStack } from 'native-base'
import { useState } from 'react'
import { type Project, type Quote, type Render, getWorks } from 'src/api/queries/getWorks'

export function Quotes() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const {
    data: works,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
  })

  const quotes = works?.docs[0].quotes

  function handleViewDocument(quote: Quote) {
    navigation.navigate('document_view', {
      title: quote.quote.title,
      hasApprovalFlow: false,
      source: {
        // uri: `https://arqplanner-cms-staging.payloadcms.app${project.project.file.url}`,
        uri: `http://192.168.1.100:3000${quote.quote.file.url}`,
        cache: true,
      },
    })
  }

  return (
    <VStack flex={1} bg={'gray.50'}>
      <ListScreenHeader title={'Orçamentos'} bg={'white'} />

      <FlatList
        data={[
          {
            label: 'Todos',
            value: 'all',
          },
        ]}
        keyExtractor={item => item.value}
        horizontal
        renderItem={({ item }) => <Category name={item.label} isActive />}
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
        data={quotes}
        keyExtractor={item => item.id}
        style={{
          shadowColor: '#000000',
          shadowOpacity: 0.05,
          shadowRadius: 30,
          shadowOffset: { width: 0, height: 4 },
        }}
        renderItem={({ item }) => (
          <ListItem
            title={item.quote.title}
            icon={<Icon as={Feather} name="dollar-sign" size={6} color="light.700" />}
            onPress={() => handleViewDocument(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        _contentContainerStyle={{
          paddingBottom: 20,
          ...(!quotes?.length && { flex: 1, justifyContent: 'center' }),
        }}
        ListEmptyComponent={() => (
          <ListEmpty
            px={10}
            icon="dollar-sign"
            title="Nenhum orçamento encontrado"
            message="Você ainda não possui nenhum orçamento adicionado."
          />
        )}
      />
    </VStack>
  )
}

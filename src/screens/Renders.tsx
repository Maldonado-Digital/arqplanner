import { Category } from '@components/Category'
import { ListEmpty } from '@components/ListEmpty'
import { type ApprovalStatus, ListItem } from '@components/ListItem'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useQuery } from '@tanstack/react-query'
import { approvalStatus } from '@utils/constants'
import { format } from 'date-fns'
import { FlatList, Icon, VStack } from 'native-base'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { type Render, getWorks } from 'src/api/queries/getWorks'

export function Renders() {
  const [selectedStatus, setSelectedStatus] = useState('all')

  const {
    data: works,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
  })

  const renders = works?.docs[0].renders
  const filteredRenders = renders?.filter(
    render => render.render.status === selectedStatus || selectedStatus === 'all',
  )

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleViewMedia(renderId: string) {
    navigation.navigate('medias', { id: renderId, hasApprovalFlow: true, type: 'render' })
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <VStack flex={1} bg={'gray.50'}>
        <ListScreenHeader
          title={'Imagens 3D'}
          onClickSettings={() => navigation.navigate('profile')}
        />

        <FlatList
          data={approvalStatus}
          keyExtractor={item => item.value}
          horizontal
          renderItem={({ item }) => (
            <Category
              name={item.plural}
              isActive={
                selectedStatus.toLocaleLowerCase() === item.value.toLocaleLowerCase()
              }
              onPress={() => setSelectedStatus(item.value)}
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
          data={filteredRenders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ListItem
              title={item.render.title}
              subTitle={format(
                item.render.files[0].uploads.updatedAt,
                "dd-MM-yy' | 'H:mm",
              )}
              icon={<Icon as={Feather} name="box" size={6} color="light.700" />}
              onPress={() => handleViewMedia(item.id)}
              status={item.render.status}
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            paddingBottom: 20,
            ...(!renders?.length && { flex: 1, justifyContent: 'center' }),
          }}
          ListEmptyComponent={() => (
            <ListEmpty
              px={10}
              icon="box"
              title="Nenhuma imagem 3D foi encontrada"
              message="Você ainda não possui nenhuma imagem 3D adicionada."
            />
          )}
        />
      </VStack>
    </SafeAreaView>
  )
}

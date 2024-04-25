import { Category } from '@components/Category'
import { ListEmpty } from '@components/ListEmpty'
import { ListItem } from '@components/ListItem'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Loading } from '@components/Loading'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '@hooks/useAuth'
import { useRefresh } from '@hooks/useRefresh'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useQuery } from '@tanstack/react-query'
import { approvalStatus } from '@utils/constants'
import { format } from 'date-fns'
import { Center, FlatList, Icon, Text, VStack } from 'native-base'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getWorks } from 'src/api/queries/getWorks'

export function Renders() {
  const { signOut } = useAuth()
  const [selectedStatus, setSelectedStatus] = useState('all')

  const {
    data: works,
    isError,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
    retry: false,
  })
  const { refreshing, handleRefresh } = useRefresh(refetch)

  if (!isPending && (isError || !works?.docs[0])) {
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

  const renders = works?.docs[0].renders
  const filteredRenders = renders?.filter(
    render => render.render.status === selectedStatus || selectedStatus === 'all',
  )

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleViewMedia(renderId: string) {
    navigation.navigate('medias', { mediaId: renderId, mediaType: 'render' })
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <VStack flex={1} bg={'gray.50'}>
        <ListScreenHeader
          title={'Imagens 3D'}
          onClickMenu={() => navigation.navigate('profile')}
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              style={{
                height: refreshing ? 30 : 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          }
          renderItem={({ item }) => (
            <ListItem
              title={item.render.title}
              subTitle={format(
                item.render.files[0].uploads.updatedAt,
                "dd-MM-yy' | 'HH:mm",
              )}
              icon={<Icon as={Feather} name="box" size={6} color="light.700" />}
              onPress={() => handleViewMedia(item.id)}
              status={item.render.status}
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            paddingBottom: 20,
            ...(!!renders?.length && {
              shadowColor: '#000000',
              shadowOpacity: 0.05,
              shadowRadius: 30,
              shadowOffset: { width: 0, height: 4 },
            }),
            ...(!renders?.length && { flex: 1, justifyContent: 'center' }),
          }}
          ListEmptyComponent={() => (
            <ListEmpty
              px={10}
              py={40}
              icon="box"
              title="Nenhuma perspectiva foi encontrada"
              message="Você ainda não possui nenhuma perspectiva adicionada."
            />
          )}
        />
      </VStack>
    </SafeAreaView>
  )
}

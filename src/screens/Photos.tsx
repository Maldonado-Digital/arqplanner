import { ListEmpty } from '@components/ListEmpty'
import { ListItem } from '@components/ListItem'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Loading } from '@components/Loading'
import { SessionExpired } from '@components/SessionExpired'
import { Feather } from '@expo/vector-icons'
import { useRefresh } from '@hooks/useRefresh'
import { useNavigation } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { FlatList, Icon, VStack } from 'native-base'
import { RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { type Photo, getWorks } from 'src/api/queries/getWorks'

export function Photos() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

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

  const photos = works?.docs[0]?.photos.sort((a, b) => {
    if (!a.photo.files.length || !b.photo.files.length) return 0

    return (
      new Date(b.photo.files[0]?.uploads.updatedAt).getTime() -
      new Date(a.photo.files[0]?.uploads.updatedAt).getTime()
    )
  })

  function handleViewMedia(media: Photo) {
    navigation.navigate('medias', { mediaId: media.id, mediaType: 'photo' })
  }

  if (isError) return <SessionExpired />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top']}>
      <VStack flex={1} bg={'gray.50'}>
        <ListScreenHeader
          title={'Fotos'}
          onClickMenu={() => navigation.navigate('profile')}
          borderBottomWidth={1}
          borderBottomColor={'#00000012'}
          mb={6}
        />

        {isPending && <Loading bg={'gray.50'} />}

        {!isPending && (
          <FlatList
            data={photos}
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
                title={item.photo.title}
                subTitle={
                  item.photo.files.length
                    ? format(item.photo.files[0]?.uploads.updatedAt, "dd-MM-yy' | 'HH:mm")
                    : 'Sem fotos'
                }
                icon={
                  <Icon
                    as={Feather}
                    name="image"
                    size={{ base: 6, sm: 6, md: 6, lg: 10 }}
                    color="light.700"
                  />
                }
                onPress={() => handleViewMedia(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              paddingBottom: 20,
              ...(!!photos?.length && {
                shadowColor: '#000000',
                shadowOpacity: 0.05,
                shadowRadius: 30,
                shadowOffset: { width: 0, height: 4 },
              }),
              ...(!photos?.length && { flex: 1, justifyContent: 'center' }),
            }}
            ListEmptyComponent={() => (
              <ListEmpty
                px={12}
                py={{ base: '1/2', sm: '3/5', md: '3/5', lg: '2/5' }}
                icon="image"
                title="Nenhuma foto encontrada nos arquivos"
                message="Você ainda não possui nenhuma foto cadastrada."
              />
            )}
          />
        )}
      </VStack>
    </SafeAreaView>
  )
}

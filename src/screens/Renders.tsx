import { Category } from '@components/Category'
import { ListEmpty } from '@components/ListEmpty'
import { ListItem } from '@components/ListItem'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Loading } from '@components/Loading'
import { SessionExpired } from '@components/SessionExpired'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '@hooks/useAuth'
import { useRefresh } from '@hooks/useRefresh'
import { useNavigation } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useQuery } from '@tanstack/react-query'
import { FILE_EXTENSION_ICON_MAP, approvalStatus } from '@utils/constants'
import { format } from 'date-fns'
import { FlatList, Icon, Text, VStack, useBreakpointValue } from 'native-base'
import { useState } from 'react'
import { RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getWorks } from 'src/api/queries/getWorks'

export function Renders() {
  const iconSize = useBreakpointValue({
    base: 36,
    sm: 36,
    md: 40,
    lg: 60,
  })
  const navigation = useNavigation<AppNavigatorRoutesProps>()
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

  const renders = works?.docs[0].renders.sort((a, b) => {
    return (
      new Date(b.render.files[0].uploads.updatedAt).getTime() -
      new Date(a.render.files[0].uploads.updatedAt).getTime()
    )
  })

  const filteredRenders = renders?.filter(
    render => render.render.status === selectedStatus || selectedStatus === 'all',
  )

  function handleViewMedia(renderId: string) {
    navigation.navigate('medias', { mediaId: renderId, mediaType: 'render' })
  }

  if (isError) return <SessionExpired />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top']}>
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
          _contentContainerStyle={{
            px: {
              base: 4,
              sm: 4,
              md: 6,
              lg: 8,
            },
          }}
          maxH={{ base: 8, sm: 10, md: 10, lg: 16 }}
          minH={{ base: 8, sm: 10, md: 10, lg: 16 }}
          bg={'white'}
          borderBottomWidth={1}
          borderBottomColor={'#00000012'}
          mb={{ base: 5, sm: 6, md: 6, lg: 12 }}
        />

        {isPending && <Loading bg={'gray.50'} />}

        {!isPending && (
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
            renderItem={({ item }) => {
              let icon = (
                <Icon
                  as={Feather}
                  name="box"
                  size={{ base: 6, sm: 6, md: 6, lg: 12 }}
                  color="light.700"
                />
              )
              const ext = item.render.files[0].uploads.filename.split('.').pop()
              const ExtIcon =
                FILE_EXTENSION_ICON_MAP[ext as keyof typeof FILE_EXTENSION_ICON_MAP]

              if (ExtIcon) icon = <ExtIcon width={iconSize} height={iconSize} />

              return (
                <ListItem
                  title={item.render.title}
                  subTitle={format(
                    item.render.files[0].uploads.updatedAt,
                    "dd-MM-yy' | 'HH:mm",
                  )}
                  icon={icon}
                  onPress={() => handleViewMedia(item.id)}
                  status={item.render.status}
                />
              )
            }}
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
                px={12}
                py={{ base: '1/2', sm: '3/5', md: '3/5', lg: '2/5' }}
                icon="box"
                title="Nenhuma perspectiva foi encontrada"
                message="Você ainda não possui nenhuma perspectiva adicionada."
              />
            )}
          />
        )}
      </VStack>
    </SafeAreaView>
  )
}

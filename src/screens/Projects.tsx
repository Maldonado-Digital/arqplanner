import { Category } from '@components/Category'
import { ListEmpty } from '@components/ListEmpty'
import { type ItemStatus, ListItem } from '@components/ListItem'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Loading } from '@components/Loading'
import { Feather } from '@expo/vector-icons'
import { useRefresh } from '@hooks/useRefresh'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useQuery } from '@tanstack/react-query'
import { projectStatus } from '@utils/constants'
import { format } from 'date-fns'
import { env } from 'env'
import { FlatList, Icon, VStack } from 'native-base'
import { useState } from 'react'
import { RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { type Project, getWorks } from 'src/api/queries/getWorks'

export function Projects() {
  const [selectedStatus, setSelectedStatus] = useState('all')

  const {
    data: works,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
  })
  const { refreshing, handleRefresh } = useRefresh(refetch)

  const projects = works?.docs[0].projects.sort((a, b) => {
    return (
      new Date(b.project.file.updatedAt).getTime() -
      new Date(a.project.file.updatedAt).getTime()
    )
  })
  const filteredProjects = projects?.filter(project => {
    if (selectedStatus === 'all') {
      return project.project.status !== 'archived'
    }

    return project.project.status === selectedStatus
  })

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleViewDocument(project: Project) {
    navigation.navigate('document_view', {
      id: project.id,
      title: project.project.title,
      subTitle: format(project.project.file.updatedAt, "dd-MM-yy' | 'H:mm"),
      hasApprovalFlow: true,
      source: {
        uri: `${env.EXPO_PUBLIC_API_URL}${project.project.file.url}`,
        cache: true,
      },
    })
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <VStack flex={1} bg={'gray.50'}>
        <ListScreenHeader
          title={'Projetos'}
          onClickSettings={() => navigation.navigate('profile')}
        />

        <FlatList
          data={projectStatus}
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

        {isLoading && <Loading bg={'gray.50'} />}

        {!isLoading && !error && (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                // progressViewOffset={statusBarHeight + 40}
                style={{
                  height: refreshing ? 30 : 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fafafa',
                }}
              />
            }
            data={filteredProjects}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ListItem
                id={item.id}
                title={item.project.title}
                subTitle={format(item.project.file.updatedAt, "dd-MM-yy' | 'H:mm")}
                icon={<Icon as={Feather} name="layout" size={6} color="light.700" />}
                onPress={() => handleViewDocument(item)}
                status={item.project.status}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              paddingBottom: 20,
              ...(!projects?.length && { flex: 1, justifyContent: 'center' }),
            }}
            ListEmptyComponent={() => (
              <ListEmpty
                px={12}
                py={40}
                icon="folder"
                title="Nenhum projeto foi encontrado"
                message="Você ainda não possui nenhum projeto adicionado."
              />
            )}
          />
        )}
      </VStack>
    </SafeAreaView>
  )
}

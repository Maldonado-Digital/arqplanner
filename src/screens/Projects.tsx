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
import { type Project, getWorks } from 'src/api/queries/getWorks'

export function Projects() {
  const [selectedStatus, setSelectedStatus] = useState('all')

  const {
    data: works,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
  })

  const projects = works?.docs[0].projects
  const filteredProjects = projects?.filter(
    project =>
      project.project.status === selectedStatus || selectedStatus === 'all',
  )

  console.log(projects)
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleViewDocument(project: Project) {
    navigation.navigate('document_view', {
      title: project.project.title,
      hasApprovalFlow: true,
      source: {
        // uri: `https://arqplanner-cms-staging.payloadcms.app${project.project.file.url}`,
        uri: `http://192.168.1.100:3000${project.project.file.url}`,
        cache: true,
      },
    })
  }

  return (
    <VStack flex={1} bg={'gray.50'}>
      <ListScreenHeader
        title={'Projetos'}
        bg={'white'}
        onClickSettings={() => {}}
      />

      <FlatList
        data={projectStatus}
        keyExtractor={item => item.value}
        horizontal
        renderItem={({ item }) => (
          <Category
            name={item.label}
            isActive={
              selectedStatus.toLocaleLowerCase() ===
              item.value.toLocaleLowerCase()
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
        data={filteredProjects}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={item.project.title}
            icon={
              <Icon as={Feather} name="layout" size={6} color="light.700" />
            }
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
            px={10}
            icon="folder"
            title="Nenhum projeto foi encontrado"
            message="Você ainda não possui nenhum projeto adicionado."
          />
        )}
      />
    </VStack>
  )
}

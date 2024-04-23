import { Category } from '@components/Category'
import { ListEmpty } from '@components/ListEmpty'
import { type ItemStatus, ListItem } from '@components/ListItem'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Loading } from '@components/Loading'
import { Toast } from '@components/Toast'
import { Feather } from '@expo/vector-icons'
import { useRefresh } from '@hooks/useRefresh'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useQuery } from '@tanstack/react-query'
import { PDF_MIME_TYPE, projectStatus } from '@utils/constants'
import { downloadFile } from '@utils/downloadFile'
import { format } from 'date-fns'
import { env } from 'env'
import * as FileSystem from 'expo-file-system'
import { shareAsync } from 'expo-sharing'
import {
  Actionsheet,
  FlatList,
  HStack,
  Heading,
  Icon,
  IconButton,
  Spinner,
  Text,
  VStack,
  View,
  ZStack,
  useDisclose,
  useToast,
} from 'native-base'
import { useState } from 'react'
import { Pressable, RefreshControl, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { type Project, getWorks } from 'src/api/queries/getWorks'

export function Projects() {
  const toast = useToast()
  const { onOpen, onClose } = useDisclose()
  const navigation = useNavigation<AppNavigatorRoutesProps>()
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

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedProjectID, setSelectedProjectID] = useState('')

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

  function handleOpenMenu() {
    setIsMenuOpen(true)
    onOpen()
  }

  function handleCloseMenu() {
    setSelectedProjectID('')
    setIsMenuOpen(false)
    onClose()
  }

  async function handleDownload() {
    const selectedProject = projects?.find(p => p.id === selectedProjectID) as Project
    try {
      setIsDownloading(true)

      await new Promise(resolve => setTimeout(resolve, 1000))
      await downloadFile(`${env.EXPO_PUBLIC_API_URL}${selectedProject.project.file.url}`)

      await toast.show({
        duration: 3000,
        render: ({ id }) => (
          <Toast id={id} message="Download concluído com sucesso." status="success" />
        ),
      })

      setIsDownloading(false)
      handleCloseMenu()
    } catch (error) {
      setIsDownloading(false)

      toast.show({
        duration: 3000,
        render: ({ id }) => (
          <Toast
            id={id}
            message="Erro ao baixar arquivo. Tente novamente."
            status="error"
          />
        ),
      })
    }
  }

  function handleShare() {
    const selectedProject = projects?.find(p => p.id === selectedProjectID) as Project
    console.log(`${env.EXPO_PUBLIC_API_URL}${selectedProject.project.file.url}`)
    shareAsync(`${env.EXPO_PUBLIC_API_URL}${selectedProject.project.file.url}`)
  }

  function handleItemPressed(project: Project) {
    setSelectedProjectID(project.id)
    const { mimeType } = project.project.file

    if (mimeType === PDF_MIME_TYPE) {
      return handleViewDocument(project)
    }

    handleOpenMenu()
  }

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
          <View
            flex={1}
            style={{
              shadowColor: '#000000',
              shadowOpacity: 0.07,
              shadowRadius: 30,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <FlatList
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
              data={filteredProjects}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ListItem
                  id={item.id}
                  title={item.project.title}
                  subTitle={format(item.project.file.updatedAt, "dd-MM-yy' | 'H:mm")}
                  icon={<Icon as={Feather} name="layout" size={6} color="light.700" />}
                  onPress={() => handleItemPressed(item)}
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
          </View>
        )}

        <Actionsheet
          isOpen={isMenuOpen}
          onClose={handleCloseMenu}
          hideDragIndicator={false}
        >
          <Actionsheet.Content borderTopRadius="3xl" bg={'white'}>
            <VStack w={'full'} pt={6}>
              <HStack
                alignItems={'center'}
                justifyContent={'space-between'}
                px={10}
                pb={6}
                borderBottomColor={'muted.200'}
                borderBottomWidth={1}
              >
                <Heading fontSize={'2xl'} color="light.700" fontFamily={'heading'}>
                  Configurações
                </Heading>

                <IconButton
                  w={11}
                  h={11}
                  variant={'outline'}
                  rounded={'full'}
                  bg={'white'}
                  borderColor={'muted.200'}
                  onPress={handleCloseMenu}
                  _pressed={{ bg: 'muted.300' }}
                  _icon={{
                    size: 5,
                    as: Feather,
                    name: 'x',
                    color: 'light.700',
                  }}
                />
              </HStack>

              <Pressable
                onPress={handleShare}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.3 : 1,
                })}
              >
                <HStack
                  bg={'white'}
                  alignItems={'center'}
                  px={10}
                  py={6}
                  borderBottomWidth={1}
                  borderBottomColor={'muted.200'}
                >
                  <Icon as={Feather} size={5} name="share-2" color={'light.700'} mr={5} />

                  <Text fontSize={'md'} fontFamily={'heading'} color={'light.700'}>
                    Compartilhar
                  </Text>
                </HStack>
              </Pressable>

              <Pressable
                onPress={handleDownload}
                style={({ pressed }) => ({
                  opacity: pressed || isDownloading ? 0.3 : 1,
                })}
              >
                <HStack w={'full'} alignItems={'center'} px={10} py={6}>
                  {isDownloading && <Spinner w={5} color={'light.700'} mr={5} />}

                  {!isDownloading && (
                    <Icon
                      as={Feather}
                      size={5}
                      name="arrow-down-circle"
                      color={'light.700'}
                      mr={5}
                    />
                  )}

                  <Text fontSize={'md'} fontFamily={'heading'} color={'light.700'}>
                    Salvar arquivo
                  </Text>
                </HStack>
              </Pressable>
            </VStack>
          </Actionsheet.Content>
        </Actionsheet>
      </VStack>
    </SafeAreaView>
  )
}

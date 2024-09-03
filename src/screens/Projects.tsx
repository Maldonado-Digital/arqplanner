import { Button } from '@components/Button'
import { Category } from '@components/Category'
import { ListEmpty } from '@components/ListEmpty'
import { ListItem } from '@components/ListItem'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Loading } from '@components/Loading'
import { SessionExpired } from '@components/SessionExpired'
import { Toast } from '@components/Toast'
import { Feather } from '@expo/vector-icons'
import { useRefresh } from '@hooks/useRefresh'
import { useNavigation } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppError } from '@utils/AppError'
import {
  FILE_EXTENSION_ICON_MAP,
  PDF_MIME_TYPE,
  approvalStatus,
  projectTypes,
} from '@utils/constants'
import { downloadFile } from '@utils/downloadFile'
import { format } from 'date-fns'
import * as Haptics from 'expo-haptics'
import * as MediaLibrary from 'expo-media-library'
import { shareAsync } from 'expo-sharing'
import {
  Actionsheet,
  FlatList,
  HStack,
  Icon,
  IconButton,
  KeyboardAvoidingView,
  SectionList,
  Spinner,
  Text,
  TextArea,
  VStack,
  useBreakpointValue,
  useDisclose,
  useToast,
} from 'native-base'
import { useState } from 'react'
import { Platform, Pressable, RefreshControl } from 'react-native'
import ImageView from 'react-native-image-viewing'
import { SafeAreaView } from 'react-native-safe-area-context'
import { type ResolveProjectDTO, resolveProject } from 'src/api/mutations/resolveProject'
import {
  type GetWorksResponse,
  type Project,
  type ProjectType,
  getWorks,
} from 'src/api/queries/getWorks'

type GroupedProjects = Record<ProjectType, Project[]>
type ImageProps = {
  key: string
  uri: string
}

export function Projects() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { onOpen, onClose } = useDisclose()
  const iconSize = useBreakpointValue({
    base: 36,
    sm: 36,
    md: 40,
    lg: 60,
  })
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions()

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

  const [images, setImages] = useState([] as Array<ImageProps>)
  const [comments, setComments] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedProjectID, setSelectedProjectID] = useState('')
  const [selectedOption, setSelectedOption] = useState<'approve' | 'reject' | null>(null)

  const projects = works?.docs[0].projects.sort((a, b) => {
    return (
      new Date(b.project.file.updatedAt).getTime() -
      new Date(a.project.file.updatedAt).getTime()
    )
  })

  const groupedProjects: GroupedProjects = {
    executive: [],
    wet_spaces_detailing: [],
    wood_detailing: [],
  }

  const filteredProjects = projects?.filter(project => {
    if (selectedStatus === 'all') {
      return project.project.status !== 'archived'
    }

    return project.project.status === selectedStatus
  })

  // biome-ignore lint/complexity/noForEach: <explanation>
  filteredProjects?.forEach(p => {
    groupedProjects[p.project.type].push(p)
  })

  const sectionListData: Array<{ title: string; data: Project[] }> = []

  for (const key in groupedProjects) {
    if (groupedProjects[key as ProjectType].length) {
      sectionListData.push({
        title: projectTypes[key as ProjectType],
        data: groupedProjects[key as ProjectType],
      })
    }
  }

  const selectedProject = filteredProjects?.find(p => p.id === selectedProjectID)
  const hasApprovalFlow = selectedProject?.project.status === 'pending'

  function updateWorksCache({
    projectId,
    status: newStatus,
    comments: newComments,
  }: ResolveProjectDTO) {
    const cached = queryClient.getQueryData<GetWorksResponse>(['works'])

    if (cached) {
      const newData = { ...cached }
      const projectIndex = newData.docs[0].projects.findIndex(
        project => project.id === projectId,
      )
      newData.docs[0].projects[projectIndex].project.status = newStatus
      newData.docs[0].projects[projectIndex].project.comments = newComments

      queryClient.setQueryData<GetWorksResponse>(['works'], newData)
    }
  }

  const { mutateAsync: resolveProjectFn, isPending: isMutating } = useMutation({
    mutationFn: resolveProject,
    onSuccess(_, { workId, projectId, status: newStatus, comments }) {
      updateWorksCache({ workId, projectId, status: newStatus, comments })
    },
  })

  function handleOpenActionSheet(option: 'approve' | 'reject') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setIsMenuOpen(false)
    setSelectedOption(option)
    onOpen()
  }

  function handleCloseActionSheet() {
    setSelectedOption(null)
    onClose()
  }

  function handleOpenMenu() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setIsMenuOpen(true)
    onOpen()
  }

  function handleCloseMenu() {
    setSelectedProjectID('')
    setIsMenuOpen(false)
    onClose()
  }

  async function handleDownload() {
    try {
      if (!selectedProject) throw new AppError('Nenhuma opção selecionada.')
      const ext = selectedProject.project.file.filename.split('.').pop()

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setIsDownloading(true)

      await new Promise(resolve => setTimeout(resolve, 500))
      const downloadedFile = await downloadFile(
        `${process.env.EXPO_PUBLIC_API_URL}${selectedProject.project.file.url}`,
      )

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

      await toast.show({
        duration: 3000,
        render: ({ id }) => (
          <Toast
            id={id}
            message="Download concluído com sucesso."
            status="success"
            onClose={() => toast.close(id)}
          />
        ),
      })

      setIsDownloading(false)
      handleCloseMenu()

      if (ext && ['png', 'jpeg', 'jpg'].includes(ext)) {
        await saveMediaToLibrary(downloadedFile.uri)
      } else {
        handleShare(downloadedFile.uri)
      }
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      setIsDownloading(false)

      toast.show({
        duration: 3000,
        render: ({ id }) => (
          <Toast
            id={id}
            message="Erro ao baixar arquivo. Tente novamente."
            status="error"
            onClose={() => toast.close(id)}
          />
        ),
      })
    }
  }

  function handleViewMedia(project: Project) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setImages([
      {
        key: project.id,
        uri: `${process.env.EXPO_PUBLIC_API_URL}${project.project.file.url}`,
      },
    ])
  }

  function handleShare(uri?: string) {
    if (!selectedProject) throw new AppError('Nenhuma opção selecionada.')
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    shareAsync(
      uri || `${process.env.EXPO_PUBLIC_API_URL}${selectedProject.project.file.url}`,
    )
  }

  function handleViewDocument(project: Project) {
    navigation.navigate('document_view', {
      documentId: project.id,
      documentType: 'project',
    })
  }

  function handleItemPressed(project: Project, isLongPress = false) {
    const { mimeType } = project.project.file
    const ext = project.project.file.filename.split('.').pop()

    if (isLongPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setSelectedProjectID(project.id)
      handleOpenMenu()
      return
    }

    if (mimeType === PDF_MIME_TYPE) {
      return handleViewDocument(project)
    }

    if (ext && ['png', 'jpeg', 'jpg'].includes(ext)) {
      return handleViewMedia(project)
    }

    setSelectedProjectID(project.id)
    handleOpenMenu()
  }

  async function saveMediaToLibrary(mediaUri: string) {
    if (permissionResponse?.status !== 'granted') {
      const response = await requestPermission()

      if (!response.granted) {
        toast.show({
          duration: 3000,
          render: ({ id }) => (
            <Toast
              id={id}
              message="Você precisa conceder acesso à suas fotos para poder fazer o download."
              status="error"
              onClose={() => toast.close(id)}
            />
          ),
        })
      }
    }

    const asset = await MediaLibrary.createAssetAsync(mediaUri)
    const album = await MediaLibrary.getAlbumAsync('ArqPlanner')

    await MediaLibrary.createAlbumAsync('ArqPlanner', asset, false)
    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false)
  }

  async function handleSubmit() {
    try {
      if (!selectedOption) throw new AppError('Nenhuma opção selecionada')
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

      await resolveProjectFn({
        workId: works?.docs[0].id as string,
        projectId: selectedProjectID,
        status: selectedOption === 'approve' ? 'approved' : 'archived',
        comments,
      })

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

      toast.show({
        duration: 3000,
        render: ({ id }) => (
          <Toast
            id={id}
            message={
              selectedOption === 'approve'
                ? 'Aprovação confirmada'
                : 'Reprovação confirmada'
            }
            status="success"
            onClose={() => toast.close(id)}
          />
        ),
      })

      handleCloseActionSheet()
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

      toast.show({
        duration: 3000,
        render: ({ id }) => (
          <Toast
            id={id}
            message="Erro ao atualizar informações. Tente novamente."
            status="error"
            onClose={() => toast.close(id)}
          />
        ),
      })
    }
  }

  if (!isPending && isError) return <SessionExpired />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top']}>
      <VStack flex={1} bg={'gray.50'}>
        <ListScreenHeader
          title={'Projetos'}
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
        />

        {isPending && <Loading bg={'gray.50'} />}

        {!isPending && (
          <SectionList
            bg={'gray.50'}
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
            sections={sectionListData}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={{
              paddingBottom: 20,
              ...(!!projects?.length && {
                shadowColor: '#000000',
                shadowOpacity: 0.05,
                shadowRadius: 30,
                shadowOffset: { width: 0, height: 4 },
              }),
              ...(!projects?.length && { flex: 1, justifyContent: 'center' }),
            }}
            renderItem={({ item }) => {
              let icon = (
                <Icon
                  as={Feather}
                  name="layout"
                  size={{ base: 6, sm: 8, md: 8, lg: 16 }}
                  color="light.700"
                  mx={1}
                />
              )
              const ext = item.project.file.filename.split('.').pop()
              if (ext && ['png', 'jpeg', 'jpg'].includes(ext)) {
                icon = (
                  <Icon
                    as={Feather}
                    name="image"
                    size={{ base: 6, sm: 6, md: 8, lg: 16 }}
                    color="light.700"
                    mx={1}
                  />
                )
              }
              const ExtIcon =
                FILE_EXTENSION_ICON_MAP[ext as keyof typeof FILE_EXTENSION_ICON_MAP]

              if (ExtIcon) icon = <ExtIcon width={iconSize} height={iconSize} />

              return (
                <ListItem
                  title={item.project.title}
                  subTitle={format(item.project.file.updatedAt, "dd-MM-yy' | 'HH:mm")}
                  icon={icon}
                  onPress={() => handleItemPressed(item)}
                  onLongPress={() => handleItemPressed(item, true)}
                  status={item.project.status}
                />
              )
            }}
            renderSectionHeader={({ section: { title } }) => (
              <Text
                fontSize={{ base: 'lg', sm: 'lg', md: 'lg', lg: '3xl' }}
                color={'light.700'}
                fontFamily={'heading'}
                px={{ base: 7, sm: 8, md: 10, lg: 16 }}
                mt={{ base: 6, sm: 6, md: 6, lg: 10 }}
                mb={{ base: 3, sm: 4, md: 4, lg: 6 }}
              >
                {title}
              </Text>
            )}
            ListEmptyComponent={() => (
              <ListEmpty
                px={12}
                py={{ base: '1/2', sm: '3/5', md: '3/5', lg: '2/5' }}
                icon="layout"
                title="Nenhum projeto foi encontrado"
                message="Você ainda não possui nenhum projeto adicionado."
              />
            )}
          />
        )}

        <ImageView
          doubleTapToZoomEnabled
          images={images}
          imageIndex={0}
          visible={!!images.length}
          onRequestClose={() => setImages([])}
        />

        <Actionsheet
          isOpen={isMenuOpen}
          onClose={handleCloseMenu}
          hideDragIndicator={false}
        >
          <Actionsheet.Content
            borderTopRadius={{ base: 28, sm: 32, md: 36, lg: 56 }}
            bg={'white'}
          >
            <VStack w={'full'} pt={{ base: 4, sm: 4, md: 4, lg: 8 }}>
              <HStack
                alignItems={'center'}
                justifyContent={'space-between'}
                px={{
                  base: 5,
                  sm: 6,
                  md: 8,
                  lg: 12,
                }}
                pb={{ base: 5, sm: 6, md: 6, lg: 12 }}
                borderBottomColor={'muted.200'}
                borderBottomWidth={1}
              >
                <Text
                  fontSize={{
                    base: 22,
                    sm: 24,
                    md: 24,
                    lg: 40,
                  }}
                  color="light.700"
                  fontFamily={'heading'}
                >
                  Configurações
                </Text>

                <IconButton
                  w={{ base: 10, sm: 10, md: 11, lg: 20 }}
                  h={{ base: 10, sm: 10, md: 11, lg: 20 }}
                  variant={'outline'}
                  rounded={'full'}
                  bg={'white'}
                  borderColor={'muted.200'}
                  onPress={handleCloseMenu}
                  _pressed={{ bg: 'muted.300' }}
                  _icon={{
                    size: { base: 5, sm: 5, md: 6, lg: 10 },
                    as: Feather,
                    name: 'x',
                    color: 'light.700',
                  }}
                />
              </HStack>

              <Pressable
                onPress={() => handleShare()}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.3 : 1,
                })}
              >
                <HStack
                  bg={'white'}
                  alignItems={'center'}
                  px={{
                    base: 5,
                    sm: 6,
                    md: 8,
                    lg: 12,
                  }}
                  py={{ base: 5, sm: 6, md: 6, lg: 10 }}
                  borderBottomWidth={1}
                  borderBottomColor={'muted.200'}
                >
                  <Icon
                    as={Feather}
                    name="share-2"
                    color={'light.700'}
                    size={{ base: 4, sm: 5, md: 5, lg: 8 }}
                    mr={{ base: 4, sm: 5, md: 5, lg: 8 }}
                  />

                  <Text
                    fontSize={{
                      base: 15,
                      sm: 15,
                      md: 16,
                      lg: 26,
                    }}
                    fontFamily={'heading'}
                    color={'light.700'}
                  >
                    Compartilhar
                  </Text>
                </HStack>
              </Pressable>

              {hasApprovalFlow && (
                <>
                  <Pressable
                    onPress={() => handleOpenActionSheet('approve')}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.3 : 1,
                    })}
                  >
                    <HStack
                      bg={'white'}
                      alignItems={'center'}
                      px={{
                        base: 5,
                        sm: 6,
                        md: 8,
                        lg: 12,
                      }}
                      py={{ base: 5, sm: 6, md: 6, lg: 10 }}
                      borderBottomWidth={1}
                      borderBottomColor={'muted.200'}
                    >
                      <Icon
                        as={Feather}
                        name="check"
                        color={'light.700'}
                        size={{ base: 4, sm: 5, md: 5, lg: 8 }}
                        mr={{ base: 4, sm: 5, md: 5, lg: 8 }}
                      />

                      <Text
                        fontSize={{
                          base: 15,
                          sm: 15,
                          md: 16,
                          lg: 26,
                        }}
                        fontFamily={'heading'}
                        color={'light.700'}
                      >
                        Aprovar
                      </Text>
                    </HStack>
                  </Pressable>

                  <Pressable
                    onPress={() => handleOpenActionSheet('reject')}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.3 : 1,
                    })}
                  >
                    <HStack
                      bg={'white'}
                      alignItems={'center'}
                      px={{
                        base: 5,
                        sm: 6,
                        md: 8,
                        lg: 12,
                      }}
                      py={{ base: 5, sm: 6, md: 6, lg: 10 }}
                      borderBottomWidth={1}
                      borderBottomColor={'muted.200'}
                    >
                      <Icon
                        as={Feather}
                        name="x"
                        color={'light.700'}
                        size={{ base: 4, sm: 5, md: 5, lg: 8 }}
                        mr={{ base: 4, sm: 5, md: 5, lg: 8 }}
                      />

                      <Text
                        fontSize={{
                          base: 15,
                          sm: 15,
                          md: 16,
                          lg: 26,
                        }}
                        fontFamily={'heading'}
                        color={'light.700'}
                      >
                        Reprovar
                      </Text>
                    </HStack>
                  </Pressable>
                </>
              )}

              <Pressable
                onPress={handleDownload}
                style={({ pressed }) => ({
                  opacity: pressed || isDownloading ? 0.3 : 1,
                })}
              >
                <HStack
                  bg={'white'}
                  alignItems={'center'}
                  px={{
                    base: 5,
                    sm: 6,
                    md: 8,
                    lg: 12,
                  }}
                  py={{ base: 5, sm: 6, md: 6, lg: 10 }}
                >
                  {isDownloading && (
                    <Spinner
                      color={'light.700'}
                      w={{ base: 4, sm: 5, md: 5, lg: 8 }}
                      mr={{ base: 4, sm: 5, md: 5, lg: 8 }}
                    />
                  )}

                  {!isDownloading && (
                    <Icon
                      as={Feather}
                      name="arrow-down-circle"
                      color={'light.700'}
                      size={{ base: 4, sm: 5, md: 5, lg: 8 }}
                      mr={{ base: 4, sm: 5, md: 5, lg: 8 }}
                    />
                  )}

                  <Text
                    fontSize={{
                      base: 15,
                      sm: 15,
                      md: 16,
                      lg: 26,
                    }}
                    fontFamily={'heading'}
                    color={'light.700'}
                  >
                    Salvar arquivo
                  </Text>
                </HStack>
              </Pressable>
            </VStack>
          </Actionsheet.Content>
        </Actionsheet>

        <Actionsheet
          isOpen={!!selectedOption}
          onClose={handleCloseActionSheet}
          hideDragIndicator={false}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            p={0}
            w={'full'}
          >
            <Actionsheet.Content
              borderTopRadius={{ base: 28, sm: 32, md: 36, lg: 56 }}
              bg={'white'}
            >
              <VStack
                w={'full'}
                px={{
                  base: 5,
                  sm: 6,
                  md: 8,
                  lg: 12,
                }}
                pb={{ base: 5, sm: 6, md: 6, lg: 12 }}
                pt={{ base: 4, sm: 4, md: 4, lg: 8 }}
              >
                <HStack alignItems={'center'} justifyContent={'space-between'} mb={4}>
                  <Text
                    fontSize={{
                      base: 22,
                      sm: 24,
                      md: 24,
                      lg: 40,
                    }}
                    color="light.700"
                    fontFamily={'heading'}
                  >
                    {selectedOption === 'reject'
                      ? 'Confirmar reprovação'
                      : 'Confirmar aprovação'}
                  </Text>

                  <IconButton
                    w={{ base: 10, sm: 10, md: 11, lg: 20 }}
                    h={{ base: 10, sm: 10, md: 11, lg: 20 }}
                    variant={'outline'}
                    rounded={'full'}
                    bg={'white'}
                    borderColor={'muted.200'}
                    onPress={handleCloseActionSheet}
                    _pressed={{ bg: 'muted.300' }}
                    _icon={{
                      size: { base: 5, sm: 5, md: 6, lg: 10 },
                      as: Feather,
                      name: 'x',
                      color: 'light.700',
                    }}
                  />
                </HStack>

                <Text
                  fontFamily={'body'}
                  fontSize={{
                    base: 15,
                    sm: 15,
                    md: 16,
                    lg: 26,
                  }}
                  color={'light.500'}
                  mb={{ base: 5, sm: 6, md: 6, lg: 12 }}
                  my={{ base: 1, sm: 2, md: 2, lg: 4 }}
                  maxWidth={{ base: 'full', sm: 'full', md: 'full', lg: '80%' }}
                >
                  {selectedOption === 'reject'
                    ? 'Clique no botão abaixo para reprovar. Caso deseje, insira um comentário adicional.'
                    : 'Clique no botão abaixo para confirmar. Caso deseje, insira um comentário adicional.'}
                </Text>

                <TextArea
                  numberOfLines={16}
                  h={{ base: 28, sm: 32, md: 32, lg: 56 }}
                  px={{ base: 4, sm: 4, md: 4, lg: 8 }}
                  py={{ base: 5, sm: 5, md: 5, lg: 10 }}
                  mb={{ base: 5, sm: 6, md: 6, lg: 12 }}
                  bg={'gray.50'}
                  rounded={{ base: 'xl', sm: 'xl', md: 'xl', lg: '3xl' }}
                  autoFocus={false}
                  placeholder="Comentários (opcional)"
                  borderColor={'muted.200'}
                  autoCompleteType={false}
                  focusOutlineColor="light.700"
                  _focus={{ bg: 'gray.50' }}
                  onChangeText={setComments}
                  fontSize={{
                    base: 13,
                    sm: 14,
                    md: 14,
                    lg: 24,
                  }}
                />

                <Button
                  title={
                    selectedOption === 'reject'
                      ? 'Confirmar reprovação'
                      : 'Confirmar aprovação'
                  }
                  rounded={'full'}
                  fontFamily={'heading'}
                  fontSize={{ base: 15, sm: 15, md: 16, lg: 26 }}
                  variant={selectedOption === 'reject' ? 'subtle' : 'solid'}
                  onPress={handleSubmit}
                  isLoading={isMutating}
                />
              </VStack>
            </Actionsheet.Content>
          </KeyboardAvoidingView>
        </Actionsheet>
      </VStack>
    </SafeAreaView>
  )
}

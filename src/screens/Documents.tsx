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
import { useQuery } from '@tanstack/react-query'
import { AppError } from '@utils/AppError'
import {
  FILE_EXTENSION_ICON_MAP,
  PDF_MIME_TYPE,
  documentsCategories,
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
  Spinner,
  Text,
  VStack,
  useBreakpointValue,
  useDisclose,
  useToast,
} from 'native-base'
import { useState } from 'react'
import { Pressable, RefreshControl } from 'react-native'
import ImageView from 'react-native-image-viewing'
import { SafeAreaView } from 'react-native-safe-area-context'
import { type Document, getWorks } from 'src/api/queries/getWorks'

type ImageProps = {
  key: string
  uri: string
}

export function Documents() {
  const toast = useToast()
  const { onOpen, onClose } = useDisclose()
  const iconSize = useBreakpointValue({
    base: 36,
    sm: 40,
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDocumentID, setSelectedDocumentID] = useState('')

  const documents = works?.docs[0].documents.sort((a, b) => {
    return (
      new Date(b.document.file.updatedAt).getTime() -
      new Date(a.document.file.updatedAt).getTime()
    )
  })

  const filteredDocuments = documents?.filter(
    document => document.document.type === selectedCategory || selectedCategory === 'all',
  )

  const selectedDocument = filteredDocuments?.find(p => p.id === selectedDocumentID)

  function handleOpenMenu() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setIsMenuOpen(true)
    onOpen()
  }

  function handleCloseMenu() {
    setSelectedDocumentID('')
    setIsMenuOpen(false)
    onClose()
  }

  function handleViewDocument(document: Document) {
    navigation.navigate('document_view', {
      documentId: document.id,
      documentType: 'document',
    })
  }

  function handleViewMedia(document: Document) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setImages([
      {
        key: document.id,
        uri: `${process.env.EXPO_PUBLIC_API_URL}${document.document.file.url}`,
      },
    ])
  }

  function handleItemPressed(document: Document, isLongPress = false) {
    const { mimeType } = document.document.file
    const ext = document.document.file.filename.split('.').pop()

    if (isLongPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setSelectedDocumentID(document.id)
      handleOpenMenu()
      return
    }

    if (mimeType === PDF_MIME_TYPE) {
      return handleViewDocument(document)
    }

    if (ext && ['png', 'jpeg', 'jpg'].includes(ext)) {
      return handleViewMedia(document)
    }

    setSelectedDocumentID(document.id)
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

  async function handleDownload() {
    try {
      if (!selectedDocument) throw new AppError('Nenhuma opção selecionada.')
      const ext = selectedDocument.document.file.filename.split('.').pop()

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setIsDownloading(true)

      await new Promise(resolve => setTimeout(resolve, 500))
      const downloadedFile = await downloadFile(
        `${process.env.EXPO_PUBLIC_API_URL}${selectedDocument.document.file.url}`,
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
      console.log(err)
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

  function handleShare(uri?: string) {
    if (!selectedDocument) throw new AppError('Nenhuma opção selecionada.')
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    shareAsync(
      uri || `${process.env.EXPO_PUBLIC_API_URL}${selectedDocument.document.file.url}`,
    )
  }

  if (isPending) return <Loading />

  if (isError) return <SessionExpired />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top']}>
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
            data={filteredDocuments}
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
                  name="folder"
                  size={{ base: 6, sm: 6, md: 8, lg: 16 }}
                  color="light.700"
                  mx={1}
                />
              )
              const ext = item.document.file.filename.split('.').pop()
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
                  title={item.document.title}
                  subTitle={format(item.document.file.updatedAt, "dd-MM-yy' | 'HH:mm")}
                  icon={icon}
                  onPress={() => handleItemPressed(item)}
                  onLongPress={() => handleItemPressed(item, true)}
                />
              )
            }}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              paddingBottom: 20,
              ...(!!documents?.length && {
                shadowColor: '#000000',
                shadowOpacity: 0.05,
                shadowRadius: 30,
                shadowOffset: { width: 0, height: 4 },
              }),
              ...(!documents?.length && { flex: 1, justifyContent: 'center' }),
            }}
            ListEmptyComponent={() => (
              <ListEmpty
                px={12}
                py={{ base: '1/2', sm: '3/5', md: '3/5', lg: '2/5' }}
                icon="folder"
                title="Nenhum documento foi encontrado"
                message="Você ainda não possui nenhum documento adicionado."
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
                <Text fontSize={'2xl'} color="light.700" fontFamily={'heading'}>
                  Configurações
                </Text>

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
                onPress={() => handleShare()}
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

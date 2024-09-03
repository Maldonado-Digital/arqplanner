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
import { FILE_EXTENSION_ICON_MAP, PDF_MIME_TYPE } from '@utils/constants'
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
import { type Quote, getWorks } from 'src/api/queries/getWorks'

type ImageProps = {
  key: string
  uri: string
}

export function Quotes() {
  const toast = useToast()
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedQuoteID, setSelectedQuoteID] = useState('')

  const quotes = works?.docs[0].quotes.sort((a, b) => {
    return (
      new Date(b.quote.file.updatedAt).getTime() -
      new Date(a.quote.file.updatedAt).getTime()
    )
  })

  const selectedQuote = quotes?.find(p => p.id === selectedQuoteID)

  function handleOpenMenu() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setIsMenuOpen(true)
    onOpen()
  }

  function handleCloseMenu() {
    setSelectedQuoteID('')
    setIsMenuOpen(false)
    onClose()
  }

  function handleViewDocument(quote: Quote) {
    navigation.navigate('document_view', {
      documentId: quote.id,
      documentType: 'quote',
    })
  }

  function handleViewMedia(quote: Quote) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setImages([
      {
        key: quote.id,
        uri: `${process.env.EXPO_PUBLIC_API_URL}${quote.quote.file.url}`,
      },
    ])
  }

  function handleItemPressed(quote: Quote, isLongPress = false) {
    const { mimeType } = quote.quote.file
    const ext = quote.quote.file.filename.split('.').pop()

    if (isLongPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setSelectedQuoteID(quote.id)
      handleOpenMenu()
      return
    }

    if (mimeType === PDF_MIME_TYPE) {
      return handleViewDocument(quote)
    }

    if (ext && ['png', 'jpeg', 'jpg'].includes(ext)) {
      return handleViewMedia(quote)
    }

    setSelectedQuoteID(quote.id)
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
      if (!selectedQuote) throw new AppError('Nenhuma opção selecionada.')
      const ext = selectedQuote.quote.file.filename.split('.').pop()

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setIsDownloading(true)

      await new Promise(resolve => setTimeout(resolve, 500))
      const downloadedFile = await downloadFile(
        `${process.env.EXPO_PUBLIC_API_URL}${selectedQuote.quote.file.url}`,
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

  function handleShare(uri?: string) {
    if (!selectedQuote) throw new AppError('Nenhuma opção selecionada.')
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    shareAsync(uri || `${process.env.EXPO_PUBLIC_API_URL}${selectedQuote.quote.file.url}`)
  }

  if (isError) return <SessionExpired />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top']}>
      <VStack flex={1} bg={'gray.50'}>
        <ListScreenHeader
          title={'Orçamentos'}
          onClickMenu={() => navigation.navigate('profile')}
          borderBottomWidth={1}
          borderBottomColor={'#00000012'}
          mb={6}
        />

        {isPending && <Loading bg={'gray.50'} />}

        {!isPending && (
          <FlatList
            data={quotes}
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
                  name="dollar-sign"
                  size={{ base: 6, sm: 8, md: 8, lg: 16 }}
                  color="light.700"
                  mx={1}
                />
              )
              const ext = item.quote.file.filename.split('.').pop()
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
                  title={item.quote.title}
                  subTitle={format(item.quote.file.updatedAt, "dd-MM-yy' | 'HH:mm")}
                  icon={icon}
                  onPress={() => handleItemPressed(item)}
                  onLongPress={() => handleItemPressed(item, true)}
                />
              )
            }}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              paddingBottom: 20,
              ...(!!quotes?.length && {
                shadowColor: '#000000',
                shadowOpacity: 0.05,
                shadowRadius: 30,
                shadowOffset: { width: 0, height: 4 },
              }),
              ...(!quotes?.length && { flex: 1, justifyContent: 'center' }),
            }}
            ListEmptyComponent={() => (
              <ListEmpty
                px={12}
                py={{ base: '1/2', sm: '3/5', md: '3/5', lg: '2/5' }}
                icon="dollar-sign"
                title="Nenhum orçamento encontrado"
                message="Você ainda não possui nenhum orçamento adicionado."
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
      </VStack>
    </SafeAreaView>
  )
}

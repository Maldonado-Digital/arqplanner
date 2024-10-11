import { ApprovalFooter } from '@components/ApprovalFooter'
import { Button } from '@components/Button'
import { ListEmpty } from '@components/ListEmpty'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Loading } from '@components/Loading'
import { SessionExpired } from '@components/SessionExpired'
import { Toast } from '@components/Toast'
import { Feather } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import type { MediasRouteParams } from '@routes/app.routes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppError } from '@utils/AppError'
import { downloadFile } from '@utils/downloadFile'
import { digViewingMediaData } from '@utils/helpers'
import * as Haptics from 'expo-haptics'
import * as MediaLibrary from 'expo-media-library'
import { shareAsync } from 'expo-sharing'
import {
  Actionsheet,
  FlatList,
  HStack,
  Icon,
  IconButton,
  Image,
  KeyboardAvoidingView,
  Spinner,
  Text,
  TextArea,
  VStack,
  useDisclose,
  useToast,
} from 'native-base'
import { useState } from 'react'
import { Platform, Pressable, RefreshControl, useWindowDimensions } from 'react-native'

import ImageView from 'react-native-image-viewing'
import { SafeAreaView } from 'react-native-safe-area-context'
import { type ResolveRenderDTO, resolveRender } from 'src/api/mutations/resolveRender'
import { type GetWorksResponse, getWorks } from 'src/api/queries/getWorks'

type ImageProps = {
  key: string
  uri: string
}

export function Medias() {
  const route = useRoute()
  const toast = useToast()
  const queryClient = useQueryClient()

  const { onOpen, onClose } = useDisclose()
  const { width } = useWindowDimensions()
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions()

  const { mediaId, mediaType } = route.params as MediasRouteParams

  const [comments, setComments] = useState('')
  const [isViewing, setIsViewing] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedOption, setSelectedOption] = useState<'approve' | 'reject' | null>(null)

  const {
    data: works,
    isError,
    isPending,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
    retry: false,
  })

  const { mutateAsync: resolveRenderFn, isPending: isMutating } = useMutation({
    mutationFn: resolveRender,
    onSuccess(_, { workId, renderId, status: newStatus, comments }) {
      updateWorksCache({ workId, renderId, status: newStatus, comments })
    },
  })

  if (isPending) return <Loading />

  if (isError) return <SessionExpired />

  const { data } = digViewingMediaData(works.docs[0], mediaType, mediaId)

  if (!data) {
    // Improve this error flow
    return <SessionExpired />
  }

  const { title, subTitle, files, status } = data

  const images = files.map(({ uploads, id }) => ({
    key: id,
    uri: `${process.env.EXPO_PUBLIC_API_URL}${uploads.url}`,
  })) as Array<ImageProps>

  const hasApprovalFlow =
    mediaType === 'render' && status === 'pending' && !!images.length

  function updateWorksCache({
    renderId,
    status: newStatus,
    comments: newComments,
  }: ResolveRenderDTO) {
    const cached = queryClient.getQueryData<GetWorksResponse>(['works'])

    if (cached) {
      const newData = { ...cached }
      const renderIndex = newData.docs[0].renders.findIndex(
        render => render.id === renderId,
      )
      newData.docs[0].renders[renderIndex].render.status = newStatus
      newData.docs[0].renders[renderIndex].render.comments = newComments

      queryClient.setQueryData<GetWorksResponse>(['works'], newData)
    }
  }

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
    setIsMenuOpen(false)
    onClose()
  }

  function handleImagePress(idx: number, isLongPress = false) {
    setCurrentIndex(idx)

    if (isLongPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      handleOpenMenu()
      return
    }

    setIsViewing(true)
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    try {
      // if (!currentIndex) throw new AppError('Nenhuma opção selecionada.')
      setIsDownloading(true)

      await new Promise(resolve => setTimeout(resolve, 1000))
      const { uri } = await downloadFile(
        `${process.env.EXPO_PUBLIC_API_URL}${files[currentIndex].uploads.url}`,
      )

      await saveMediaToLibrary(uri)
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
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      setIsDownloading(false)

      toast.show({
        duration: 3000,
        render: ({ id }) => (
          <Toast
            id={id}
            message="Ocorreu um erro ao salvar a imagem. Tente novamente."
            status="error"
            onClose={() => toast.close(id)}
          />
        ),
      })
    }
  }

  function handleShare() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    shareAsync(`${process.env.EXPO_PUBLIC_API_URL}${files[currentIndex].uploads.url}`)
  }

  async function handleSubmit() {
    try {
      if (!selectedOption) throw new AppError('Nenhuma opção selecionada')
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

      await resolveRenderFn({
        workId: works?.docs[0].id as string,
        renderId: mediaId,
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

  const numColumns = 3
  const gap = 2

  const availableSpace = width - (numColumns - 1) * gap
  const itemSize = availableSpace / numColumns

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top']}>
      <VStack flex={1} bg={'gray.50'}>
        <ListScreenHeader
          mb={6}
          title={title}
          subTitle={subTitle}
          status={status}
          borderBottomColor={'muted.200'}
          borderBottomWidth={1}
          onClickMenu={handleOpenMenu}
          isMenuDisabled={true}
        />

        <FlatList
          flex={1}
          data={images}
          columnWrapperStyle={{ gap }}
          contentContainerStyle={{ gap }}
          numColumns={numColumns}
          keyExtractor={item => item.key}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              style={{
                height: isRefetching ? 30 : 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          }
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => handleImagePress(index)}
              onLongPress={() => handleImagePress(index, true)}
              delayLongPress={300}
            >
              {({ pressed }) => (
                <Image
                  source={{
                    uri: item.uri,
                    width: itemSize,
                    height: itemSize,
                  }}
                  resizeMode="cover"
                  alt=""
                  style={{
                    aspectRatio: 1,
                    opacity: pressed ? 0.8 : 1,
                    transform: [
                      {
                        scale: pressed ? 1.03 : 1,
                      },
                    ],
                  }}
                />
              )}
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            paddingBottom: 20,
            ...(!images?.length && {
              flex: 1,
              justifyContent: 'center',
              minHeight: 'full',
            }),
          }}
          ListEmptyComponent={() => (
            <ListEmpty
              h={'full'}
              px={10}
              my={48}
              icon={mediaType === 'photo' ? 'image' : 'box'}
              title={`Nenhuma ${
                mediaType === 'render' ? 'perspectiva' : 'foto'
              } foi encontrada`}
              message={`Você não possui nenhuma ${
                mediaType === 'render' ? 'perspectiva' : 'foto'
              } cadastrada ainda.`}
            />
          )}
        />

        <ImageView
          doubleTapToZoomEnabled
          images={images}
          imageIndex={currentIndex}
          visible={isViewing}
          onRequestClose={() => setIsViewing(false)}
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
                onPress={handleShare}
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

              {/* {false && (
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
              )} */}

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

        {hasApprovalFlow && (
          <>
            <ApprovalFooter
              title={'Aprovar imagens?'}
              position={'absolute'}
              bottom={0}
              left={0}
              onOpenDisclose={handleOpenActionSheet}
            />

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
          </>
        )}
      </VStack>
    </SafeAreaView>
  )
}

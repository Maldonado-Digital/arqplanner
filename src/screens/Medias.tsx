import { ApprovalFooter } from '@components/ApprovalFooter'
import { Button } from '@components/Button'
import { ListEmpty } from '@components/ListEmpty'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Loading } from '@components/Loading'
import { Toast } from '@components/Toast'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '@hooks/useAuth'
import { useRoute } from '@react-navigation/native'
import type { MediasRouteParams } from '@routes/app.routes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppError } from '@utils/AppError'
import { downloadFile } from '@utils/downloadFile'
import { digViewingMediaData } from '@utils/helpers'
import * as MediaLibrary from 'expo-media-library'
import { shareAsync } from 'expo-sharing'
import {
  Actionsheet,
  Center,
  FlatList,
  HStack,
  Heading,
  Icon,
  IconButton,
  Image,
  KeyboardAvoidingView,
  Pressable,
  Spinner,
  Text,
  TextArea,
  VStack,
  useDisclose,
  useToast,
} from 'native-base'
import { useState } from 'react'
import { Platform, Vibration, useWindowDimensions } from 'react-native'

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

  const { signOut } = useAuth()
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
    error,
    isLoading,
  } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
    retry: false,
  })

  if (isLoading) return <Loading />

  if (error || !works?.docs[0]) {
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

  const { title, subTitle, status, files } = digViewingMediaData(
    works.docs[0],
    mediaType,
    mediaId,
  )

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

  const { mutateAsync: resolveRenderFn, isPending } = useMutation({
    mutationFn: resolveRender,
    onSuccess(_, { workId, renderId, status: newStatus, comments }) {
      updateWorksCache({ workId, renderId, status: newStatus, comments })
    },
  })

  function handleOpenActionSheet(option: 'approve' | 'reject') {
    setIsMenuOpen(false)
    setSelectedOption(option)
    onOpen()
  }

  function handleCloseActionSheet() {
    setSelectedOption(null)
    onClose()
  }

  function handleOpenMenu() {
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
      Vibration.vibrate(50)
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
    try {
      setIsDownloading(true)

      await new Promise(resolve => setTimeout(resolve, 1000))
      const { uri } = await downloadFile(
        `${process.env.EXPO_PUBLIC_API_URL}${files[currentIndex].uploads.url}`,
      )

      await saveMediaToLibrary(uri)

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
    shareAsync(`${process.env.EXPO_PUBLIC_API_URL}${files[currentIndex].uploads.url}`)
  }

  async function handleSubmit() {
    try {
      if (!selectedOption) throw new AppError('Nenhuma opção selecionada')

      await resolveRenderFn({
        workId: works?.docs[0].id as string,
        renderId: mediaId,
        status: selectedOption === 'approve' ? 'approved' : 'archived',
        comments,
      })

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
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <VStack flex={1} bg={'gray.50'}>
        <ListScreenHeader
          mb={6}
          title={title}
          subTitle={subTitle}
          status={status}
          borderBottomColor={'muted.200'}
          borderBottomWidth={1}
          onClickMenu={handleOpenMenu}
          isMenuDisabled={!hasApprovalFlow}
        />
        <FlatList
          flex={1}
          data={images}
          columnWrapperStyle={{ gap }}
          contentContainerStyle={{ gap }}
          numColumns={numColumns}
          keyExtractor={item => item.key}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => handleImagePress(index)}
              onLongPress={() => handleImagePress(index, true)}
              delayLongPress={300}
            >
              {({ isPressed }) => (
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
                    opacity: isPressed ? 0.8 : 1,
                    transform: [
                      {
                        scale: isPressed ? 1.03 : 1,
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
                      px={10}
                      py={6}
                      borderBottomWidth={1}
                      borderBottomColor={'muted.200'}
                    >
                      <Icon
                        as={Feather}
                        size={5}
                        name="check"
                        color={'light.700'}
                        mr={5}
                      />

                      <Text fontSize={'md'} fontFamily={'heading'} color={'light.700'}>
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
                      px={10}
                      py={6}
                      borderBottomWidth={1}
                      borderBottomColor={'muted.200'}
                    >
                      <Icon as={Feather} size={5} name="x" color={'light.700'} mr={5} />

                      <Text fontSize={'md'} fontFamily={'heading'} color={'light.700'}>
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
                <HStack bg={'white'} alignItems={'center'} px={10} py={6}>
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
                <Actionsheet.Content borderTopRadius="3xl" bg={'white'}>
                  <VStack w={'full'} px={10} pt={6}>
                    <HStack alignItems={'center'} justifyContent={'space-between'} mb={4}>
                      <Heading fontSize={'2xl'} color="light.700" fontFamily={'heading'}>
                        {selectedOption === 'reject'
                          ? 'Confirmar reprovação'
                          : 'Confirmar aprovação'}
                      </Heading>

                      <IconButton
                        w={11}
                        h={11}
                        variant={'outline'}
                        rounded={'full'}
                        bg={'white'}
                        borderColor={'muted.200'}
                        onPress={handleCloseActionSheet}
                        _pressed={{ bg: 'muted.300' }}
                        _icon={{
                          size: 5,
                          as: Feather,
                          name: 'x',
                          color: 'light.700',
                        }}
                      />
                    </HStack>

                    <Text fontFamily={'body'} fontSize={'md'} color={'light.500'} mb={6}>
                      {selectedOption === 'reject'
                        ? 'Clique no botão abaixo para reprovar. Caso deseje, insira um comentário adicional.'
                        : 'Clique no botão abaixo para confirmar. Caso deseje, insira um comentário adicional.'}
                    </Text>

                    <TextArea
                      numberOfLines={16}
                      h={32}
                      px={4}
                      py={5}
                      mb={6}
                      bg={'gray.50'}
                      rounded={'xl'}
                      autoFocus={false}
                      placeholder="Comentários (opcional)"
                      borderColor={'muted.200'}
                      autoCompleteType={false}
                      focusOutlineColor="light.700"
                      _focus={{ bg: 'gray.50' }}
                      fontSize={'sm'}
                      onChangeText={setComments}
                    />

                    <Button
                      title={
                        selectedOption === 'reject'
                          ? 'Confirmar reprovação'
                          : 'Confirmar aprovação'
                      }
                      rounded={'full'}
                      fontFamily={'heading'}
                      fontSize={'md'}
                      variant={selectedOption === 'reject' ? 'subtle' : 'solid'}
                      onPress={handleSubmit}
                      isLoading={isPending}
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

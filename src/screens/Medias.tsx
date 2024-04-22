import { ApprovalFooter } from '@components/ApprovalFooter'
import { Button } from '@components/Button'
import { ListEmpty } from '@components/ListEmpty'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Toast } from '@components/Toast'
import { Feather } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { env } from 'env'
import {
  Actionsheet,
  FlatList,
  HStack,
  Heading,
  IconButton,
  Image,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextArea,
  VStack,
  useDisclose,
  useToast,
} from 'native-base'
import { useState } from 'react'
import { Platform, useWindowDimensions } from 'react-native'
import Gallery from 'react-native-awesome-gallery'
import ImageView from 'react-native-image-viewing'
import { SafeAreaView } from 'react-native-safe-area-context'
import { type Photo, type Render, getWorks } from 'src/api/queries/getWorks'

type MediasRouteParams = {
  id: string
  hasApprovalFlow: boolean
  type: 'photo' | 'render'
}

type ImageProps = {
  key: string
  uri: string
}

export function Medias() {
  const toast = useToast()
  const route = useRoute()
  const { id, hasApprovalFlow, type } = route.params as MediasRouteParams
  const { isOpen, onOpen, onClose } = useDisclose()
  const { width } = useWindowDimensions()
  const [isViewing, setIsViewing] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [comments, setComments] = useState('')
  const [isResolved, setIsResolved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState<'approve' | 'reject'>('approve')

  const { data: works, error } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
  })

  const data =
    type === 'photo'
      ? works?.docs[0].photos.find(p => p.id === id)?.photo
      : works?.docs[0].renders.find(r => r.id === id)?.render

  const images = data?.files.map(({ uploads, id }) => ({
    key: id,
    uri: `${env.EXPO_PUBLIC_API_URL}${uploads.url}`,
  })) as Array<ImageProps>

  const shouldShowApprovalFooter = hasApprovalFlow && !isResolved && !!images.length

  function handleOpenDisclose(disclose: 'approve' | 'reject') {
    onOpen()
  }

  function handleOpenSettings() {
    // setIsSettingsOpen(true)
    onOpen()
  }

  function handleImagePress(idx: number) {
    setIsViewing(true)
    setCurrentIndex(idx)
  }

  async function handleSubmit() {
    setIsResolved(true)
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    onClose()
    setComments('')
    setIsLoading(false)

    toast.show({
      duration: 5000,
      render: ({ id }) => (
        <Toast id={id} message="Aprovação confirmada!" status="success" />
      ),
    })
  }

  const numColumns = 3
  const gap = 2

  const availableSpace = width - (numColumns - 1) * gap
  const itemSize = availableSpace / numColumns

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <VStack flex={1} bg={'gray.50'}>
        <ListScreenHeader
          title={data?.title as string}
          subTitle={format(
            data?.files[0].uploads.updatedAt as string,
            "dd-MM-yy' | 'H:mm",
          )}
          borderBottomColor={'muted.200'}
          borderBottomWidth={1}
          onClickSettings={handleOpenSettings}
        />
        <FlatList
          flex={1}
          data={images}
          columnWrapperStyle={{ gap }}
          contentContainerStyle={{ gap }}
          numColumns={numColumns}
          keyExtractor={item => item.key}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => handleImagePress(index)}>
              <Image
                source={{
                  uri: item.uri,
                  width: itemSize,
                  height: itemSize,
                }}
                resizeMode="cover"
                alt=""
                style={{ aspectRatio: 1 }}
              />
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
              icon={type === 'photo' ? 'image' : 'box'}
              title={`Nenhuma ${
                type === 'render' ? 'imagem 3D' : 'foto'
              } foi encontrada nos arquivos`}
              message={`Por enquanto, nenhuma imagem ${
                type === 'render' ? '3D ' : ''
              }foi adicionada a essa coleção.`}
            />
          )}
        />
        <ImageView
          images={images}
          imageIndex={currentIndex}
          visible={isViewing}
          onRequestClose={() => setIsViewing(false)}
          onLongPress={handleOpenSettings}
        />

        {shouldShowApprovalFooter && (
          <>
            <ApprovalFooter
              position={'absolute'}
              bottom={0}
              left={0}
              onOpenDisclose={handleOpenDisclose}
            />

            <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator={false}>
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
                        onPress={onClose}
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
                      isLoading={isLoading}
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

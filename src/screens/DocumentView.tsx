import { ApprovalFooter } from '@components/ApprovalFooter'
import { Button } from '@components/Button'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Loading } from '@components/Loading'
import { SessionExpired } from '@components/SessionExpired'
import { Toast } from '@components/Toast'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '@hooks/useAuth'
import { useRoute } from '@react-navigation/native'
import type { DocumentViewRouteParams } from '@routes/app.routes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppError } from '@utils/AppError'
import { downloadFile } from '@utils/downloadFile'
import { digViewingDocumentData } from '@utils/helpers'
import { shareAsync } from 'expo-sharing'
import {
  Actionsheet,
  HStack,
  Heading,
  Icon,
  IconButton,
  KeyboardAvoidingView,
  Spinner,
  Text,
  TextArea,
  VStack,
  useDisclose,
  useToast,
} from 'native-base'
import { useState } from 'react'
import { Platform, Pressable } from 'react-native'
import PDF from 'react-native-pdf'
import { SafeAreaView } from 'react-native-safe-area-context'
import { type ResolveProjectDTO, resolveProject } from 'src/api/mutations/resolveProject'
import { type GetWorksResponse, getWorks } from 'src/api/queries/getWorks'

export function DocumentView() {
  const route = useRoute()
  const toast = useToast()
  const queryClient = useQueryClient()

  const { signOut } = useAuth()
  const { onOpen, onClose } = useDisclose()

  const { documentId, documentType } = route.params as DocumentViewRouteParams

  const [comments, setComments] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedOption, setSelectedOption] = useState<'approve' | 'reject' | null>(null)

  const {
    data: works,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
    retry: false,
  })

  const { mutateAsync: resolveProjectFn, isPending: isMutating } = useMutation({
    mutationFn: resolveProject,
    onSuccess(_, { workId, projectId, status: newStatus, comments }) {
      updateWorksCache({ workId, projectId, status: newStatus, comments })
    },
  })

  if (isPending) return <Loading />

  if (isError) return <SessionExpired />

  const { data } = digViewingDocumentData(works.docs[0], documentType, documentId)

  if (!data) return <SessionExpired />
  const { title, subTitle, status, file } = data

  const hasApprovalFlow = documentType === 'project' && status === 'pending'

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

  async function handleDownload() {
    try {
      setIsDownloading(true)

      await new Promise(resolve => setTimeout(resolve, 1000))
      await downloadFile(`${process.env.EXPO_PUBLIC_API_URL}${file.url}`)

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
            message="Erro ao baixar arquivo. Tente novamente."
            status="error"
            onClose={() => toast.close(id)}
          />
        ),
      })
    }
  }

  function handleShare() {
    shareAsync(`${process.env.EXPO_PUBLIC_API_URL}${file.url}`)
  }

  async function handleSubmit() {
    try {
      if (!selectedOption) throw new AppError('Nenhuma opção selecionada')

      await resolveProjectFn({
        workId: works?.docs[0].id as string,
        projectId: documentId,
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

  function onLoadPDFError() {
    toast.show({
      duration: 3000,
      render: ({ id }) => (
        <Toast
          id={id}
          message="Erro ao carregar o PDF. Tente novamente."
          status="error"
          onClose={() => toast.close(id)}
        />
      ),
    })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top']}>
      <VStack flex={1} bg={'gray.50'} position={'relative'}>
        <ListScreenHeader
          mb={6}
          title={title}
          subTitle={subTitle}
          status={status}
          borderBottomColor={'muted.200'}
          borderBottomWidth={1}
          onClickMenu={handleOpenMenu}
        />
        <PDF
          onError={onLoadPDFError}
          source={{
            uri: `${process.env.EXPO_PUBLIC_API_URL}${file.url}`,
            cache: true,
          }}
          style={{
            backgroundColor: 'transparent',
            flex: 1,
            borderTopColor: '#00000012',
            borderTopWidth: 1,
            paddingBottom: 16,
          }}
          onLoadComplete={(nOfPages, filePath) => {
            console.log('Number of pages', nOfPages)
          }}
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

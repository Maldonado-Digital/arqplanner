import { ApprovalFooter } from '@components/ApprovalFooter'
import { Button } from '@components/Button'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Toast } from '@components/Toast'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '@hooks/useAuth'
import { useRoute } from '@react-navigation/native'
import * as FileSystem from 'expo-file-system'
import { shareAsync } from 'expo-sharing'
import {
  Actionsheet,
  HStack,
  Heading,
  Icon,
  IconButton,
  KeyboardAvoidingView,
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
import { resolveProject } from 'src/api/mutations/resolveProject'
import type { Work } from 'src/api/queries/getWorks'
import { api } from 'src/lib/api'

type DocumentViewRouteParams = {
  id: string
  title: string
  subTitle?: string
  hasApprovalFlow: boolean
  source: {
    uri: string
    cache: boolean
  }
}

export function DocumentView() {
  const route = useRoute()
  const toast = useToast()
  const { user } = useAuth()
  const { onOpen, onClose } = useDisclose()
  const { id, title, subTitle, source, hasApprovalFlow } =
    route.params as DocumentViewRouteParams

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResolved, setIsResolved] = useState(false)
  const [comments, setComments] = useState('')
  const [selectedOption, setSelectedOption] = useState<'approve' | 'reject' | null>(null)

  function handleOpenActionSheet(option: 'approve' | 'reject') {
    setSelectedOption(option)
    onOpen()
  }

  function handleCloseActionSheet() {
    setSelectedOption(null)
    onClose()
  }

  function handleOpenSettings() {
    setIsSettingsOpen(true)
    onOpen()
  }

  function handleCloseSettings() {
    setIsSettingsOpen(false)
    onClose()
  }

  async function handleDownload(fileUri: string) {
    const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
      const progress =
        downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
      console.log('Download Progress: ', progress)
    }

    const downloadResumable = FileSystem.createDownloadResumable(
      fileUri,
      `${FileSystem.documentDirectory}${fileUri.split('/').pop()}`,
      {},
      callback,
    )

    try {
      const { uri } =
        (await downloadResumable.downloadAsync()) as FileSystem.FileSystemDownloadResult
      console.log('Finished downloading to ', uri)
    } catch (e) {
      console.error(e)
    }
  }

  async function submitApproval() {
    setIsLoading(true)
    try {
      const response = await resolveProject({
        workId: (user.works[0] as Work).id,
        projectId: id,
        status: selectedOption === 'approve' ? 'approved' : 'archived',
      })

      handleCloseActionSheet()
    } catch (error) {
      toast.show({
        duration: 3000,
        render: ({ id }) => (
          <Toast
            id={id}
            message="Erro ao atualizar informações. Tente novamente."
            status="error"
          />
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit() {
    if (!selectedOption) {
      toast.show({
        duration: 3000,
        placement: 'top',
        render: ({ id }) => (
          <Toast
            id={id}
            message={'Erro ao enviar resposta. Tente novamente'}
            status="error"
            onClose={() => toast.close(id)}
          />
        ),
      })
    }

    submitApproval()
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <VStack flex={1} bg={'gray.50'} position={'relative'}>
        <ListScreenHeader
          mb={6}
          title={title}
          subTitle={subTitle}
          borderBottomColor={'muted.200'}
          borderBottomWidth={1}
          onClickSettings={handleOpenSettings}
        />
        <PDF
          onError={error => console.log(error)}
          source={source}
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
          isOpen={isSettingsOpen}
          onClose={handleCloseSettings}
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
                  onPress={handleCloseSettings}
                  _pressed={{ bg: 'muted.300' }}
                  _icon={{
                    size: 5,
                    as: Feather,
                    name: 'x',
                    color: 'light.700',
                  }}
                />
              </HStack>

              <Pressable onPress={() => shareAsync(source.uri)}>
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
                  <Pressable>
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

                  <Pressable>
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

              <Pressable onPress={() => handleDownload(source.uri)}>
                <HStack bg={'white'} alignItems={'center'} px={10} py={6}>
                  <Icon
                    as={Feather}
                    size={5}
                    name="arrow-down-circle"
                    color={'light.700'}
                    mr={5}
                  />

                  <Text fontSize={'md'} fontFamily={'heading'} color={'light.700'}>
                    Salvar arquivo
                  </Text>
                </HStack>
              </Pressable>
            </VStack>
          </Actionsheet.Content>
        </Actionsheet>

        {hasApprovalFlow && !isResolved && (
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

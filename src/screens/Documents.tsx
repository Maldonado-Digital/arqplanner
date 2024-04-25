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
import { PDF_MIME_TYPE, documentsCategories } from '@utils/constants'
import { downloadFile } from '@utils/downloadFile'
import { format } from 'date-fns'
import * as Haptics from 'expo-haptics'
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
  useDisclose,
  useToast,
} from 'native-base'
import { useState } from 'react'
import { Pressable, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { type Document, getWorks } from 'src/api/queries/getWorks'

export function Documents() {
  const toast = useToast()
  const { onOpen, onClose } = useDisclose()
  const navigation = useNavigation<AppNavigatorRoutesProps>()

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

  function handleItemPressed(document: Document) {
    const { mimeType } = document.document.file

    if (mimeType === PDF_MIME_TYPE) {
      return handleViewDocument(document)
    }

    setSelectedDocumentID(document.id)
    handleOpenMenu()
  }

  async function handleDownload() {
    try {
      if (!selectedDocument) throw new AppError('Nenhuma opção selecionada.')

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setIsDownloading(true)

      await new Promise(resolve => setTimeout(resolve, 1000))
      await downloadFile(
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

  function handleShare() {
    if (!selectedDocument) throw new AppError('Nenhuma opção selecionada.')
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    shareAsync(`${process.env.EXPO_PUBLIC_API_URL}${selectedDocument.document.file.url}`)
  }

  // if (isPending) return <Loading />

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
          _contentContainerStyle={{ px: 6 }}
          maxH={10}
          minH={10}
          bg={'white'}
          borderBottomWidth={1}
          borderBottomColor={'#00000012'}
          mb={6}
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
            renderItem={({ item }) => (
              <ListItem
                title={item.document.title}
                subTitle={format(item.document.file.updatedAt, "dd-MM-yy' | 'HH:mm")}
                icon={<Icon as={Feather} name="folder" size={6} color="light.700" />}
                onPress={() => handleItemPressed(item)}
              />
            )}
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
                px={10}
                py={40}
                icon="folder"
                title="Nenhum documento foi encontrado"
                message="Você ainda não possui nenhum documento adicionado."
              />
            )}
          />
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

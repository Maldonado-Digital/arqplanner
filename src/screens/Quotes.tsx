import { Category } from '@components/Category'
import { ListEmpty } from '@components/ListEmpty'
import { ListItem } from '@components/ListItem'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Loading } from '@components/Loading'
import { SessionExpired } from '@components/SessionExpired'
import { Toast } from '@components/Toast'
import { Feather } from '@expo/vector-icons'
import { useRefresh } from '@hooks/useRefresh'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useQuery } from '@tanstack/react-query'
import { AppError } from '@utils/AppError'
import { FILE_EXTENSION_ICON_MAP, PDF_MIME_TYPE } from '@utils/constants'
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
  View,
  useBreakpointValue,
  useDisclose,
  useToast,
} from 'native-base'
import { useState } from 'react'
import { Pressable, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { type Quote, getWorks } from 'src/api/queries/getWorks'

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

  function handleItemPressed(quote: Quote) {
    const { mimeType } = quote.quote.file

    if (mimeType === PDF_MIME_TYPE) {
      return handleViewDocument(quote)
    }

    setSelectedQuoteID(quote.id)
    handleOpenMenu()
  }

  async function handleDownload() {
    try {
      if (!selectedQuote) throw new AppError('Nenhuma opção selecionada.')

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setIsDownloading(true)

      await new Promise(resolve => setTimeout(resolve, 1000))
      await downloadFile(
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
    if (!selectedQuote) throw new AppError('Nenhuma opção selecionada.')
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    shareAsync(`${process.env.EXPO_PUBLIC_API_URL}${selectedQuote.quote.file.url}`)
  }

  if (isPending) return <Loading />

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
              />
            )
            const ext = item.quote.file.filename.split('.').pop()
            const ExtIcon =
              FILE_EXTENSION_ICON_MAP[ext as keyof typeof FILE_EXTENSION_ICON_MAP]

            if (ExtIcon) icon = <ExtIcon width={iconSize} height={iconSize} />

            return (
              <ListItem
                title={item.quote.title}
                subTitle={format(item.quote.file.updatedAt, "dd-MM-yy' | 'HH:mm")}
                icon={icon}
                onPress={() => handleItemPressed(item)}
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

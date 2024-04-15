import { ApprovalFooter } from '@components/ApprovalFooter'
import { Button } from '@components/Button'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Toast } from '@components/Toast'
import { Feather } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import {
  Actionsheet,
  HStack,
  Heading,
  IconButton,
  Image,
  KeyboardAvoidingView,
  Text,
  TextArea,
  VStack,
  useDisclose,
  useToast,
} from 'native-base'
import { useState } from 'react'
import { Platform, useWindowDimensions } from 'react-native'
import Gallery from 'react-native-awesome-gallery'
import { type Photo, type Render, getWorks } from 'src/api/queries/getWorks'

type MediasRouteParams = {
  id: string
  hasApprovalFlow: boolean
}

export function Medias() {
  const toast = useToast()
  const route = useRoute()
  const { id, hasApprovalFlow } = route.params as MediasRouteParams
  const { isOpen, onOpen, onClose } = useDisclose()
  const { width } = useWindowDimensions()
  const [comments, setComments] = useState('')
  const [isResolved, setIsResolved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState<'approve' | 'reject'>(
    'approve',
  )

  const { data: works, error } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
  })

  const { photo } = works?.docs[0].photos.find(r => r.id === id) as Photo
  const images = photo.files.map(({ uploads }) => ({
    key: uploads.id,
    uri: `https://arqplanner-cms-staging.payloadcms.app${uploads.url}`,
    // uri: `http://192.168.1.100:3000${uploads.url}`,
  }))

  console.log(images)

  function handleOpenDisclose(disclose: 'approve' | 'reject') {
    onOpen()
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

  return (
    <VStack flex={1} bg={'gray.50'} position={'relative'}>
      <ListScreenHeader
        title={photo.title}
        subTitle="13-05-23 | 05:00"
        borderBottomColor={'muted.200'}
        borderBottomWidth={1}
        onClickSettings={() => {}}
      />

      <Gallery data={images} />

      {/* <HStack maxWidth={'full'} space={'2px'} w={'full'} flexWrap={'wrap'}>
        {images.map(({ key, uri }) => (
          <Image
            key={key}
            source={{
              uri,
              width: width / 3 - 2 * 2,
              height: width / 3 - 2 * 2,
            }}
            resizeMode="cover"
            mb={'2px'}
            alt=""
            style={{ aspectRatio: 1 }}
          />
        ))}
      </HStack> */}
      {hasApprovalFlow && !isResolved && (
        <>
          <ApprovalFooter
            position={'absolute'}
            bottom={0}
            left={0}
            onOpenDisclose={handleOpenDisclose}
          />

          <Actionsheet
            isOpen={isOpen}
            onClose={onClose}
            hideDragIndicator={false}
            bg={'#000000B3'}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              p={0}
              w={'full'}
            >
              <Actionsheet.Content borderTopRadius="3xl" bg={'white'}>
                <VStack w={'full'} px={10} pt={6}>
                  <HStack
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    mb={4}
                  >
                    <Heading
                      fontSize={'2xl'}
                      color="light.700"
                      fontFamily={'heading'}
                    >
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

                  <Text
                    fontFamily={'body'}
                    fontSize={'md'}
                    color={'light.500'}
                    mb={6}
                  >
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
                    placeholder="Comentários"
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
  )
}

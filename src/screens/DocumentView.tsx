import { ApprovalFooter } from '@components/ApprovalFooter'
import { Button } from '@components/Button'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Feather } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import {
  Actionsheet,
  HStack,
  Heading,
  IconButton,
  KeyboardAvoidingView,
  Text,
  TextArea,
  VStack,
  useDisclose,
} from 'native-base'
import { useState } from 'react'
import { Platform } from 'react-native'
import PDF from 'react-native-pdf'

type DocumentViewRouteParams = {
  title: string
  source: {
    uri: string
    cache: boolean
  }
}

// const source = {
//   // uri: 'https://prod-cdn.damacproperties.com/uploads/brochure/safa-one-super-luxury-collection-db-en.pdf?utm_source=&utm_medium=&utm_campaign=&campaign_id=a120Y000000uLMj',
//   uri: `http://localhost:3000`,
//   cache: true,
// }

export function DocumentView() {
  const { isOpen, onOpen, onClose } = useDisclose()
  const route = useRoute()
  const { title, source } = route.params as DocumentViewRouteParams
  const [comments, setComments] = useState('')
  const [selectedOption, setSelectedOption] = useState<'approve' | 'reject'>(
    'approve',
  )

  console.log(source)

  function handleOpenDisclose(option: 'approve' | 'reject') {
    setSelectedOption(option)
    onOpen()
  }

  function handleSubmit() {}

  return (
    <VStack flex={1} bg={'gray.50'} position={'relative'}>
      <ListScreenHeader
        title={title}
        subTitle="13-05-23 | 05:00"
        mb={6}
        borderBottomColor={'muted.200'}
        borderBottomWidth={1}
      />
      <PDF
        onError={error => console.log(error)}
        source={source}
        style={{
          flex: 1,
          borderTopColor: '#00000012',
          borderTopWidth: 1,
          paddingBottom: 16,
        }}
        onLoadComplete={(nOfPages, filePath) => {
          console.log('Number of pages', nOfPages)
        }}
      />
      {/* <ApprovalFooter
        position={'absolute'}
        bottom={0}
        left={0}
        onOpenDisclose={handleOpenDisclose}
      /> */}

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
              />
            </VStack>
          </Actionsheet.Content>
        </KeyboardAvoidingView>
      </Actionsheet>
    </VStack>
  )
}

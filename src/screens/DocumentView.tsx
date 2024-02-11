import { ApprovalFooter } from '@components/ApprovalFooter'
import { Button } from '@components/Button'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { Feather } from '@expo/vector-icons'
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
import { Platform } from 'react-native'
import PDF from 'react-native-pdf'

const source = {
  uri: 'https://prod-cdn.damacproperties.com/uploads/brochure/safa-one-super-luxury-collection-db-en.pdf?utm_source=&utm_medium=&utm_campaign=&campaign_id=a120Y000000uLMj',
  cache: true,
}

export function DocumentView() {
  const { isOpen, onOpen, onClose } = useDisclose()

  function handleOpenDisclose(disclose: 'approve' | 'reject') {
    onOpen()
  }

  return (
    <VStack flex={1} bg={'gray.50'} position={'relative'}>
      <ListScreenHeader
        title="Prestação de Serviços v1"
        subTitle="13-05-23 | 05:00"
        // mb={6}
        borderBottomColor={'muted.200'}
        borderBottomWidth={1}
      />
      <PDF
        source={source}
        style={{
          flex: 1,
          borderTopColor: '#00000012',
          borderTopWidth: 1,
          paddingBottom: 16,
          // paddingTop: 6,
        }}
        onLoadComplete={(nOfPages, filePath) => {
          console.log('Number of pages', nOfPages)
        }}
      />
      <ApprovalFooter
        position={'absolute'}
        bottom={0}
        left={0}
        onDisclose={handleOpenDisclose}
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
            <VStack w="100%" px={10} pt={6}>
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
                  Confirmar aprovação
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
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
              />

              <Button title="Confirmar aprovação" rounded={'full'} />
            </VStack>
          </Actionsheet.Content>
        </KeyboardAvoidingView>
      </Actionsheet>
    </VStack>
  )
}

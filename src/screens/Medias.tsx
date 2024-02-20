import ExampleImage from '@assets/mock-1.png'
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
  Image,
  KeyboardAvoidingView,
  Text,
  TextArea,
  VStack,
  useDisclose,
} from 'native-base'
import { Platform, useWindowDimensions } from 'react-native'

const source = {
  uri: 'https://prod-cdn.damacproperties.com/uploads/brochure/safa-one-super-luxury-collection-db-en.pdf?utm_source=&utm_medium=&utm_campaign=&campaign_id=a120Y000000uLMj',
  cache: true,
}

type MediasRouteParams = {
  title: string
}

export function Medias() {
  const route = useRoute()
  const { title } = route.params as MediasRouteParams
  const { isOpen, onOpen, onClose } = useDisclose()
  const { height, width } = useWindowDimensions()

  function handleOpenDisclose(disclose: 'approve' | 'reject') {
    onOpen()
  }

  return (
    <VStack flex={1} bg={'gray.50'} position={'relative'}>
      <ListScreenHeader
        title={title}
        subTitle="13-05-23 | 05:00"
        borderBottomColor={'muted.200'}
        borderBottomWidth={1}
      />
      <HStack maxWidth={'full'} space={'2px'} w={'full'} flexWrap={'wrap'}>
        {Array.from({ length: 18 }).map(_ => (
          <Image
            source={ExampleImage}
            w={width / 3 - 2 * 2}
            mb={'2px'}
            alt=""
            style={{ aspectRatio: 1 }}
          />
        ))}
      </HStack>
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

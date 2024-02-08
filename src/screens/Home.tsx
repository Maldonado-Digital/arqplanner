import { MenuCard } from '@components/MenuCard'
import { SliderDots } from '@components/SliderDots'
import { Feather } from '@expo/vector-icons'
import {
  Center,
  HStack,
  Heading,
  Icon,
  ScrollView,
  Text,
  VStack,
} from 'native-base'

export function Home() {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} bg={'gray.50'} pt={24} pb={20}>
        <HStack
          alignItems={'center'}
          justifyContent={'space-between'}
          mb={12}
          px={10}
        >
          <Heading fontFamily={'heading'} fontSize={'3xl'} color={'black'}>
            Bem-vindo!
          </Heading>
          <HStack alignItems={'center'}>
            <Center
              bg={'white'}
              w={12}
              h={12}
              rounded={'full'}
              borderWidth={1}
              borderColor={'gray.100'}
            >
              <Text fontFamily={'heading'} fontSize={'md'} color={'light.700'}>
                BA
              </Text>
            </Center>
            <Icon
              as={Feather}
              name="chevron-down"
              size={6}
              color={'light.700'}
              ml={2}
            />
          </HStack>
        </HStack>

        <HStack
          alignItems={'center'}
          bg={'white'}
          w={'full'}
          justifyContent={'space-between'}
          px={10}
          py={10}
          mb={6}
          borderTopWidth={1}
          borderBottomWidth={1}
          borderTopColor={'gray.100'}
          borderBottomColor={'gray.100'}
          shadow={1}
        >
          <VStack space={4} flexShrink={1}>
            <Heading fontFamily={'heading'} fontSize={'xl'} color={'light.700'}>
              Veja o status geral do projeto
            </Heading>
            <Text fontFamily={'body'} fontSize={'md'} color={'light.500'}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>
          </VStack>
          <Center
            w={28}
            h={28}
            rounded={'full'}
            borderWidth={4}
            borderColor={'light.200'}
          >
            <Center
              style={{ transform: [{ rotateZ: '45deg' }] }}
              w={28}
              h={28}
              rounded={'full'}
              borderWidth={4}
              borderRightColor={'light.400'}
              borderTopColor={'light.400'}
              borderBottomColor={'transparent'}
              borderLeftColor={'transparent'}
            >
              <Heading
                fontFamily={'heading'}
                fontSize={'lg'}
                color={'light.700'}
                style={{ transform: [{ rotateZ: '-45deg' }] }}
              >
                50%
              </Heading>
            </Center>
          </Center>
        </HStack>

        <Center mb={12}>
          <SliderDots />
        </Center>

        <VStack px={10} space={6}>
          <HStack maxW={'1'} w={'full'} space={6}>
            <MenuCard
              title="Agenda"
              icon={
                <Icon as={Feather} name="calendar" size={6} color="#F9B34A" />
              }
            />
            <MenuCard
              title="Projetos"
              icon={
                <Icon as={Feather} name="layout" size={5} color="#0F25EE" />
              }
            />
          </HStack>
          <HStack maxW={'1'} w={'full'} space={6}>
            <MenuCard
              title="3Ds"
              icon={<Icon as={Feather} name="box" size={6} color="#AD00FF" />}
            />
            <MenuCard
              title="Documentos"
              icon={
                <Icon as={Feather} name="folder" size={5} color="#A9772C" />
              }
            />
          </HStack>
          <HStack maxW={'1'} w={'full'} space={6}>
            <MenuCard
              title="Fotos"
              icon={<Icon as={Feather} name="image" size={6} color="#FF38A4" />}
            />
            <MenuCard
              title="Orçamentos"
              icon={
                <Icon
                  as={Feather}
                  name="dollar-sign"
                  size={5}
                  color="#379D60"
                />
              }
            />
          </HStack>
        </VStack>
      </VStack>
    </ScrollView>
  )
}

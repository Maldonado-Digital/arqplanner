import { MenuCard } from '@components/MenuCard'
import { SliderDots } from '@components/SliderDots'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
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
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

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
              as={<Feather name="chevron-down" strokeWidth={2} />}
              color={'light.700'}
              size={6}
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
          py={8}
          mb={6}
          borderTopWidth={1}
          borderBottomWidth={1}
          borderTopColor={'#00000012'}
          borderBottomColor={'#00000012'}
          style={{
            shadowColor: '#000000',
            shadowOpacity: 0.05,
            shadowRadius: 30,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <VStack space={4} flexShrink={1} maxW={'1/2'}>
            <Heading fontFamily={'heading'} fontSize={'xl'} color={'light.700'}>
              Veja o status do projeto
            </Heading>
            <Text fontFamily={'body'} fontSize={'md'} color={'light.500'}>
              Lorem ipsum dolor sit amet, consectetur
            </Text>
          </VStack>
          <Center
            w={34}
            h={34}
            rounded={'full'}
            borderWidth={7}
            borderColor={'muted.100'}
          >
            <Center
              style={{ transform: [{ rotateZ: '45deg' }] }}
              w={34}
              h={34}
              rounded={'full'}
              borderWidth={7}
              borderRightColor={'light.500'}
              borderTopColor={'light.500'}
              borderBottomColor={'transparent'}
              borderLeftColor={'transparent'}
            >
              <Heading
                fontFamily={'heading'}
                fontSize={'md'}
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
              onPress={() => navigation.navigate('documents')}
              title="Agenda"
              icon={
                <Icon as={Feather} name="calendar" size={6} color="#F9B34A" />
              }
            />
            <MenuCard
              onPress={() => navigation.navigate('documents')}
              title="Projetos"
              icon={
                <Icon as={Feather} name="layout" size={6} color="#0F25EE" />
              }
            />
          </HStack>
          <HStack maxW={'1'} w={'full'} space={6}>
            <MenuCard
              onPress={() => navigation.navigate('documents')}
              title="3Ds"
              icon={<Icon as={Feather} name="box" size={6} color="#AD00FF" />}
            />
            <MenuCard
              onPress={() => navigation.navigate('documents')}
              title="Documentos"
              icon={
                <Icon as={Feather} name="folder" size={6} color="#A9772C" />
              }
            />
          </HStack>
          <HStack maxW={'1'} w={'full'} space={6}>
            <MenuCard
              onPress={() => navigation.navigate('documents')}
              title="Fotos"
              icon={<Icon as={Feather} name="image" size={6} color="#FF38A4" />}
            />
            <MenuCard
              onPress={() => navigation.navigate('documents')}
              title="Orçamentos"
              icon={
                <Icon
                  as={Feather}
                  name="dollar-sign"
                  size={6}
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

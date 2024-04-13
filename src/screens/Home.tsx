import { Loading } from '@components/Loading'
import { MenuCard } from '@components/MenuCard'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '@hooks/useAuth'
import { useRefresh } from '@hooks/useRefresh'
import { useNavigation } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useQuery } from '@tanstack/react-query'
import { statusBarHeight } from '@utils/constants'
import { getInitials } from '@utils/helpers'
import {
  Center,
  HStack,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack,
  useToast,
} from 'native-base'
import { RefreshControl } from 'react-native'
import { ProgressCircle } from 'react-native-svg-charts'
import { getWorks } from 'src/api/queries/getWorks'

export function Home() {
  const { user, signOut } = useAuth()
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const initials = getInitials(user.name)

  const {
    data: works,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
  })
  const { refreshing, handleRefresh } = useRefresh(refetch)

  const totalSteps = works?.docs[0]?.steps.length ?? 0
  const stepsCompleted =
    works?.docs[0]?.steps.filter(step => step.step.is_completed).length ?? 0
  const progress = totalSteps ? stepsCompleted / totalSteps : totalSteps
  const percentage = `${progress * 100}%`

  function handleShowProfile() {
    navigation.navigate('profile')
  }

  if (isLoading) return <Loading />

  if (error) {
    return (
      <Center flex={1}>
        <Text fontFamily={'heading'} fontSize={'xl'} mb={4} color={'light.700'}>
          Erro ao buscar as informações.
        </Text>
        <Pressable onPress={signOut}>
          <Text fontFamily={'heading'} fontSize={'md'} color={'red.700'}>
            Fazer login novamente
          </Text>
        </Pressable>
      </Center>
    )
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          progressViewOffset={statusBarHeight + 40}
          style={{
            height: refreshing ? 50 : 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fafafa',
          }}
        />
      }
    >
      <VStack flex={1} bg={'gray.50'} pt={20} pb={20}>
        <HStack
          alignItems={'center'}
          justifyContent={'space-between'}
          mb={12}
          px={10}
        >
          <Heading fontFamily={'heading'} fontSize={'4xl'} color={'black'}>
            Bem-vindo!
          </Heading>
          <Pressable onPress={handleShowProfile}>
            <HStack alignItems={'center'}>
              <Center
                bg={'white'}
                w={12}
                h={12}
                rounded={'full'}
                borderWidth={1}
                borderColor={'gray.100'}
              >
                <Text
                  fontFamily={'heading'}
                  fontSize={'md'}
                  color={'light.700'}
                  textTransform={'uppercase'}
                >
                  {initials}
                </Text>
              </Center>
              <Icon
                as={<Feather name="chevron-down" strokeWidth={2} />}
                color={'light.700'}
                size={6}
                ml={2}
              />
            </HStack>
          </Pressable>
        </HStack>

        <HStack
          alignItems={'center'}
          bg={'white'}
          w={'full'}
          justifyContent={'space-between'}
          px={10}
          py={8}
          mb={12}
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
              Confira o status geral de conclusão ao lado.
            </Text>
          </VStack>

          <ProgressCircle
            style={{ height: 136, width: 136, position: 'relative' }}
            progress={progress}
            progressColor={'#797979'}
            strokeWidth={7}
          />

          <Center position={'absolute'} right={'98px'}>
            <Heading
              fontFamily={'body'}
              fontSize={'md'}
              color={'light.400'}
              mb={1}
            >
              Geral:
            </Heading>
            <Heading fontFamily={'heading'} fontSize={'md'} color={'light.700'}>
              {percentage}
            </Heading>
          </Center>
        </HStack>

        <VStack px={10} space={6}>
          <HStack maxW={'1'} w={'full'} space={6}>
            <MenuCard
              onPress={() => navigation.navigate('agenda')}
              title="Agenda"
              icon={
                <Icon as={Feather} name="calendar" size={6} color="#F9B34A" />
              }
            />
            <MenuCard
              onPress={() => navigation.navigate('projects')}
              title="Projetos"
              icon={
                <Icon as={Feather} name="layout" size={6} color="#0F25EE" />
              }
            />
          </HStack>
          <HStack maxW={'1'} w={'full'} space={6}>
            <MenuCard
              onPress={() => navigation.navigate('renders')}
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
              onPress={() => navigation.navigate('photos')}
              title="Fotos"
              icon={<Icon as={Feather} name="image" size={6} color="#FF38A4" />}
            />
            <MenuCard
              onPress={() => navigation.navigate('quotes')}
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

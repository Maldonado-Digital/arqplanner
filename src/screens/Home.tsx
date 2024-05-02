import { Loading } from '@components/Loading'
import { MenuCard } from '@components/MenuCard'
import { SessionExpired } from '@components/SessionExpired'
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
  View,
  useToast,
} from 'native-base'
import { RefreshControl, useWindowDimensions } from 'react-native'
import { ms, mvs, s, vs } from 'react-native-size-matters'
import { ProgressCircle } from 'react-native-svg-charts'
import { type GetWorksResponse, getWorks } from 'src/api/queries/getWorks'

export function Home() {
  const { user, signOut } = useAuth()
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const { width } = useWindowDimensions()
  const initials = getInitials(user.name)

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
  // const works: GetWorksResponse | undefined = !works1?.docs ? works1 : undefined

  const totalSteps = works?.docs[0]?.steps.length ?? 0
  const stepsCompleted =
    works?.docs[0]?.steps.filter(step => step.step.is_completed).length ?? 0
  const progress = totalSteps ? stepsCompleted / totalSteps : totalSteps
  const percentage = `${progress * 100}%`

  function handleShowProfile() {
    navigation.navigate('profile')
  }

  if (isPending) return <Loading />

  if (isError) return <SessionExpired />

  const numColumns = 2
  const gap = vs(20)

  const availableSpace = width - (numColumns + 1) * gap
  const itemSize = availableSpace / numColumns

  return (
    <ScrollView
      bg={'muted.50'}
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
      <VStack flex={1} bg={'gray.50'} pt={[vs(48), 20]} pb={[mvs(48), 20]}>
        <HStack
          alignItems={'center'}
          justifyContent={'space-between'}
          mb={mvs(28)}
          px={[vs(24), 10]}
        >
          <Heading fontFamily={'heading'} fontSize={[s(24), '5xl']} color={'light.700'}>
            Bem-vindo!
          </Heading>

          <Pressable onPress={handleShowProfile}>
            <HStack alignItems={'center'}>
              <Center
                bg={'white'}
                w={[ms(42), 16]}
                h={[ms(42), 16]}
                rounded={'full'}
                borderWidth={1}
                borderColor={'gray.100'}
              >
                <Text
                  fontFamily={'heading'}
                  fontSize={[mvs(13), '2xl']}
                  color={'light.700'}
                  textTransform={'uppercase'}
                >
                  {initials}
                </Text>
              </Center>
              <Icon
                as={<Feather name="chevron-down" strokeWidth={2} />}
                color={'light.700'}
                size={[s(20), 10]}
                ml={2}
              />
            </HStack>
          </Pressable>
        </HStack>

        <HStack
          alignItems={'center'}
          justifyContent={'space-between'}
          bg={'white'}
          w={'full'}
          px={[vs(24), 10]}
          py={ms(28)}
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
          <VStack flexShrink={1} maxW={'1/2'} space={4}>
            <Heading fontFamily={'heading'} fontSize={[s(20), '4xl']} color={'light.700'}>
              Veja o status do projeto
            </Heading>
            <Text fontFamily={'body'} fontSize={[s(13), '3xl']} color={'light.500'}>
              Confira o status geral de conclusão ao lado.
            </Text>
          </VStack>

          <Center position={'relative'}>
            <ProgressCircle
              style={{
                height: ms(124),
                width: ms(124),
              }}
              progress={progress}
              progressColor={'#797979'}
              strokeWidth={ms(5)}
            />

            <Center position={'absolute'}>
              <Heading
                fontFamily={'body'}
                fontSize={[s(14), '2xl']}
                color={'light.400'}
                mb={1}
              >
                Geral:
              </Heading>
              <Heading
                fontFamily={'heading'}
                fontSize={[s(14), '2xl']}
                color={'light.700'}
              >
                {percentage}
              </Heading>
            </Center>
          </Center>
        </HStack>

        <VStack px={[vs(20), 10]} space={gap}>
          <HStack maxW={'1'} w={'full'} space={gap}>
            <MenuCard
              w={itemSize}
              h={itemSize}
              onPress={() => navigation.navigate('agenda')}
              title="Agenda"
              icon={
                <Icon as={Feather} name="calendar" size={[mvs(22), 12]} color="#F9B34A" />
              }
            />
            <MenuCard
              w={itemSize}
              h={itemSize}
              onPress={() => navigation.navigate('projects')}
              title="Projetos"
              icon={
                <Icon as={Feather} name="layout" size={[mvs(22), 12]} color="#0F25EE" />
              }
            />
          </HStack>
          <HStack maxW={'1'} w={'full'} space={gap}>
            <MenuCard
              w={itemSize}
              h={itemSize}
              onPress={() => navigation.navigate('renders')}
              title="3Ds"
              icon={<Icon as={Feather} name="box" size={[mvs(22), 12]} color="#AD00FF" />}
            />
            <MenuCard
              w={itemSize}
              h={itemSize}
              onPress={() => navigation.navigate('documents')}
              title="Documentos"
              icon={
                <Icon as={Feather} name="folder" size={[mvs(22), 12]} color="#A9772C" />
              }
            />
          </HStack>
          <HStack maxW={'1'} w={'full'} space={gap}>
            <MenuCard
              w={itemSize}
              h={itemSize}
              onPress={() => navigation.navigate('photos')}
              title="Fotos"
              icon={
                <Icon as={Feather} name="image" size={[mvs(22), 12]} color="#FF38A4" />
              }
            />
            <MenuCard
              w={itemSize}
              h={itemSize}
              onPress={() => navigation.navigate('quotes')}
              title="Orçamentos"
              icon={
                <Icon
                  as={Feather}
                  name="dollar-sign"
                  size={[mvs(22), 12]}
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

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
import { ProgressChart } from 'react-native-chart-kit'

import {
  Center,
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack,
  useBreakpointValue,
} from 'native-base'
import { RefreshControl, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getWorks } from 'src/api/queries/getWorks'

export function Home() {
  const { user } = useAuth()
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const initials = getInitials(user.name)
  const { width } = useWindowDimensions()
  const flexDir = useBreakpointValue({
    base: '8%',
    lg: 'row',
  })

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
  const percentage = `${(progress * 100).toFixed(0)}%`

  function handleShowProfile() {
    navigation.navigate('profile')
  }

  if (isPending) return <Loading />
  if (isError) return <SessionExpired />

  const numColumns = 2
  const gap = 0.06 * width
  const padding = 0.08 * width

  const availableSpace = width - 2 * padding - gap
  const itemSize = availableSpace / numColumns

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
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
        <VStack
          flex={1}
          bg={'gray.50'}
          pt={{
            base: 4,
            sm: 4,
            md: 4,
            lg: 12,
          }}
          pb={{
            base: 10,
            sm: 16,
            md: 16,
            lg: 20,
          }}
        >
          <HStack
            alignItems={'center'}
            justifyContent={'space-between'}
            mb={{ base: 7, sm: 7, md: 7, lg: 16 }}
            px={'8%'}
          >
            <Text
              color={'light.700'}
              fontFamily={'heading'}
              fontSize={{
                base: 24,
                sm: 30,
                md: 32,
                lg: 48,
              }}
            >
              Bem-vindo!
            </Text>

            <Pressable onPress={handleShowProfile}>
              <HStack alignItems={'center'}>
                <Center
                  bg={'white'}
                  w={{
                    base: 10,
                    sm: 10,
                    md: 12,
                    lg: 20,
                  }}
                  h={{
                    base: 10,
                    sm: 10,
                    md: 12,
                    lg: 20,
                  }}
                  rounded={'full'}
                  borderWidth={1}
                  borderColor={'gray.100'}
                >
                  <Text
                    fontFamily={'heading'}
                    fontSize={{
                      base: 14,
                      sm: 14,
                      md: 16,
                      lg: 26,
                    }}
                    color={'light.700'}
                    textTransform={'uppercase'}
                  >
                    {initials}
                  </Text>
                </Center>
                <Icon
                  as={<Feather name="chevron-down" strokeWidth={2} />}
                  color={'light.700'}
                  size={{
                    base: 5,
                    sm: 5,
                    md: 6,
                    lg: 10,
                  }}
                  ml={{ base: 2, sm: 2, md: 2, lg: 3 }}
                  mr={{ base: -0.5, sm: -1, md: -1, lg: -2 }}
                />
              </HStack>
            </Pressable>
          </HStack>

          <HStack
            alignItems={'center'}
            justifyContent={'space-between'}
            bg={'white'}
            w={'full'}
            px={'8%'}
            py={'5%'}
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
            <VStack flexShrink={1} maxW={'1/2'}>
              <Text
                mb={4}
                fontFamily={'heading'}
                color={'light.700'}
                fontSize={{
                  base: 18,
                  sm: 18,
                  md: 20,
                  lg: 32,
                }}
              >
                Veja o status do projeto
              </Text>
              <Text
                fontFamily={'body'}
                color={'light.500'}
                fontSize={{
                  base: 14,
                  sm: 16,
                  md: 18,
                  lg: 28,
                }}
              >
                Confira o status geral de conclusão ao lado.
              </Text>
            </VStack>

            <Center position={'relative'} overflow={'visible'}>
              <ProgressChart
                data={{ data: [progress], colors: ['#797979'] }}
                width={width * 0.32}
                height={width * 0.32}
                radius={(width * 0.3) / 2}
                hideLegend
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: opacity => (opacity > 0.3 ? '#797979' : '#f5f5f5'),
                  style: {
                    borderRadius: 16,
                  },
                }}
                strokeWidth={6}
              />

              <Center position={'absolute'}>
                <Text
                  fontFamily={'body'}
                  color={'light.400'}
                  mb={1}
                  fontSize={{
                    base: 14,
                    sm: 16,
                    md: 18,
                    lg: 28,
                  }}
                >
                  Geral:
                </Text>
                <Text
                  fontFamily={'heading'}
                  color={'light.700'}
                  fontSize={{
                    base: 14,
                    sm: 16,
                    md: 18,
                    lg: 28,
                  }}
                >
                  {percentage}
                </Text>
              </Center>
            </Center>
          </HStack>

          <HStack
            // px={{
            //   base: 7,
            //   sm: 8,
            //   md: 10,
            //   lg: 20,
            // }}
            px={'8%'}
            pt={{
              base: 10,
              sm: 12,
              md: 12,
              lg: 24,
            }}
            justifyContent={'space-between'}
          >
            <VStack space={{ base: 6, sm: 6, md: 6, lg: 16 }}>
              <MenuCard
                w={itemSize}
                h={itemSize}
                onPress={() => navigation.navigate('agenda')}
                title="Agenda"
                icon={
                  <Icon
                    as={Feather}
                    name="calendar"
                    size={{ base: 5, sm: 6, md: 6, lg: 12 }}
                    color="#F9B34A"
                  />
                }
              />
              <MenuCard
                w={itemSize}
                h={itemSize}
                onPress={() => navigation.navigate('projects')}
                title="Projetos"
                icon={
                  <Icon
                    as={Feather}
                    name="layout"
                    size={{ base: 5, sm: 6, md: 6, lg: 12 }}
                    color="#0F25EE"
                  />
                }
              />
              <MenuCard
                w={itemSize}
                h={itemSize}
                onPress={() => navigation.navigate('renders')}
                title="3Ds"
                icon={
                  <Icon
                    as={Feather}
                    name="box"
                    size={{ base: 5, sm: 6, md: 6, lg: 12 }}
                    color="#AD00FF"
                  />
                }
              />
            </VStack>
            <VStack space={{ base: 6, sm: 6, md: 6, lg: 16 }}>
              <MenuCard
                w={itemSize}
                h={itemSize}
                onPress={() => navigation.navigate('documents')}
                title="Documentos"
                icon={
                  <Icon
                    as={Feather}
                    name="folder"
                    size={{ base: 5, sm: 6, md: 6, lg: 12 }}
                    color="#A9772C"
                  />
                }
              />

              <MenuCard
                w={itemSize}
                h={itemSize}
                onPress={() => navigation.navigate('photos')}
                title="Fotos"
                icon={
                  <Icon
                    as={Feather}
                    name="image"
                    size={{ base: 5, sm: 6, md: 6, lg: 12 }}
                    color="#FF38A4"
                  />
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
                    size={{ base: 5, sm: 6, md: 6, lg: 12 }}
                    color="#379D60"
                  />
                }
              />
            </VStack>
          </HStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  )
}

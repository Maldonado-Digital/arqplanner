import {
  type NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import { DocumentView } from '@screens/DocumentView'
import { Event } from '@screens/Event'
import { Home } from '@screens/Home'
import { ListScreen } from '@screens/ListScreen'
import { Medias } from '@screens/Medias'
import { Profile } from '@screens/Profile'
import { Schedule } from '@screens/Schedule'

export type AppRoutesType = {
  home: undefined
  document_view: undefined
  list_screen: { title: string }
  medias: { title: string }
  profile: undefined
  schedule: undefined
  event: {
    title: string
    markerColor: string
  }
}

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutesType>

const { Navigator, Screen, Group } = createNativeStackNavigator<AppRoutesType>()

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="list_screen" component={ListScreen} />
      <Screen name="medias" component={Medias} />
      <Screen name="document_view" component={DocumentView} />
      <Screen name="schedule" component={Schedule} />
      <Screen name="event" component={Event} />

      <Group screenOptions={{ presentation: 'fullScreenModal' }}>
        <Screen name="profile" component={Profile} />
      </Group>
    </Navigator>
  )
}

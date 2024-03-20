import {
  type NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'

import { Agenda } from '@screens/Agenda'
import { DocumentView } from '@screens/DocumentView'
import { Documents } from '@screens/Documents'
import { Event } from '@screens/Event'
import { Home } from '@screens/Home'
import { ListScreen } from '@screens/ListScreen'
import { Medias } from '@screens/Medias'
import { Profile } from '@screens/Profile'

export type AppRoutesType = {
  home: undefined
  document_view: {
    title: string
    source: {
      uri: string
      cache: boolean
    }
  }
  documents: undefined
  list_screen: { title: string }
  medias: { title: string }
  profile: undefined
  agenda: undefined
  event: { id: string; markerColor: string }
}

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutesType>

const { Navigator, Screen, Group } = createNativeStackNavigator<AppRoutesType>()

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="list_screen" component={ListScreen} />
      <Screen name="documents" component={Documents} />
      <Screen name="medias" component={Medias} />
      <Screen name="document_view" component={DocumentView} />
      <Screen name="agenda" component={Agenda} />
      <Screen name="event" component={Event} />

      <Group screenOptions={{ presentation: 'fullScreenModal' }}>
        <Screen name="profile" component={Profile} />
      </Group>
    </Navigator>
  )
}

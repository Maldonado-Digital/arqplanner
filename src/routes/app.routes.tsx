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
import { Photos } from '@screens/Photos'
import { Profile } from '@screens/Profile'
import { Projects } from '@screens/Projects'
import { Quotes } from '@screens/Quotes'
import { Renders } from '@screens/Renders'

export type AppRoutesType = {
  agenda: undefined
  home: undefined
  document_view: {
    title: string
    hasApprovalFlow: boolean
    source: {
      uri: string
      cache: boolean
    }
  }
  documents: undefined
  list_screen: { title: string }
  medias: { id: string; hasApprovalFlow: boolean }
  profile: undefined
  photos: undefined
  projects: undefined
  renders: undefined
  quotes: undefined
  event: { id: string; markerColor: string }
}

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutesType>

const { Navigator, Screen, Group } = createNativeStackNavigator<AppRoutesType>()

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="document_view" component={DocumentView} />
      <Screen name="documents" component={Documents} />
      <Screen name="medias" component={Medias} />
      <Screen name="projects" component={Projects} />
      <Screen name="photos" component={Photos} />
      <Screen name="renders" component={Renders} />
      <Screen name="agenda" component={Agenda} />
      <Screen name="event" component={Event} />
      <Screen name="quotes" component={Quotes} />

      <Group screenOptions={{ presentation: 'fullScreenModal' }}>
        <Screen name="profile" component={Profile} />
      </Group>
    </Navigator>
  )
}

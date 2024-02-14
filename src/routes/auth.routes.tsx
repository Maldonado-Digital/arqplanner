import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import { Event } from '@screens/Event'
import { Home } from '@screens/Home'
import { ListScreen } from '@screens/ListScreen'
import { Medias } from '@screens/Medias'
import { Schedule } from '@screens/Schedule'

import { DocumentView } from '@screens/DocumentView'
import { Onboarding1, Onboarding2, Onboarding3 } from '@screens/Onboarding'
import { Profile } from '@screens/Profile'
import { PasswordRecovered, RecoverPassword } from '@screens/RecoverPassword'
import { SignIn } from '@screens/SignIn'

export type AuthRoutesType = {
  document_view: undefined
  home: undefined
  list_screen: {
    title: string
  }
  medias: {
    title: string
  }
  onboarding_1: undefined
  onboarding_2: undefined
  onboarding_3: undefined
  password_recovered: undefined
  profile: undefined
  recover_password: undefined
  schedule: undefined
  sign_in: undefined
  event: {
    title: string
    markerColor: string
  }
}

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutesType>

const { Navigator, Screen, Group } =
  createNativeStackNavigator<AuthRoutesType>()

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="onboarding_1" component={Onboarding1} />
      <Screen name="onboarding_2" component={Onboarding2} />
      <Screen name="onboarding_3" component={Onboarding3} />
      <Screen name="sign_in" component={SignIn} />
      <Screen name="recover_password" component={RecoverPassword} />
      <Screen name="password_recovered" component={PasswordRecovered} />
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

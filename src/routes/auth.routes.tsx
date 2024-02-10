import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import { Documents } from '@screens/Documents'
import { Event } from '@screens/Event'
import { Home } from '@screens/Home'
import { Schedule } from '@screens/Schedule'

import { Onboarding1, Onboarding2, Onboarding3 } from '@screens/Onboarding'
import { Profile } from '@screens/Profile'
import { PasswordRecovered, RecoverPassword } from '@screens/RecoverPassword'
import { SignIn } from '@screens/SignIn'

export type AuthRoutesType = {
  documents: undefined
  home: undefined
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
      <Screen name="documents" component={Documents} />
      <Screen name="schedule" component={Schedule} />
      <Screen name="event" component={Event} />
      <Group screenOptions={{ presentation: 'fullScreenModal' }}>
        <Screen name="profile" component={Profile} />
      </Group>
    </Navigator>
  )
}

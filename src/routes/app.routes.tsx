import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import { Home } from '@screens/Home'

export type AppRoutesType = {
  home: undefined
}

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutesType>

const { Navigator, Screen } = createNativeStackNavigator<AppRoutesType>()

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
    </Navigator>
  )
}

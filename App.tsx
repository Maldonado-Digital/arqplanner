import { Routes } from '@routes/index'
import { THEME } from '@theme/index'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { NativeBaseProvider } from 'native-base'
// SplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Proxima_Nova_Regular: require('./assets/fonts/Proxima_Nova_Regular.otf'),
    Proxima_Nova_Semibold: require('./assets/fonts/Proxima_Nova_Semibold.otf'),
  })

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded || fontError) {
  //     await SplashScreen.hideAsync()
  //   }
  // }, [fontsLoaded, fontError])

  // if (!fontsLoaded && !fontError) {
  //   return null
  // }

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      {fontsLoaded && <Routes />}
    </NativeBaseProvider>
  )
}

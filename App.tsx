import { Routes } from '@routes/index'
import { THEME } from '@theme/index'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { NativeBaseProvider } from 'native-base'
// SplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Satoshi_Regular: require('./assets/fonts/Satoshi_Regular.otf'),
    Satoshi_Medium: require('./assets/fonts/Satoshi_Medium.otf'),
    MarkPro_Regular: require('./assets/fonts/MarkPro_Regular.otf'),
    MarkPro_Medium: require('./assets/fonts/MarkPro_Medium.otf'),
    MarkPro_Bold: require('./assets/fonts/MarkPro_Bold.otf'),
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

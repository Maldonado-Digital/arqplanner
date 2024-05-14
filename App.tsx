import { AuthProvider } from '@contexts/AuthContext'
import { Routes } from '@routes/index'
import { QueryClientProvider } from '@tanstack/react-query'
import { THEME } from '@theme/index'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { NativeBaseProvider } from 'native-base'
import 'react-native-gesture-handler'
// SplashScreen.preventAutoHideAsync()
import * as Updates from 'expo-updates'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { queryClient } from 'src/lib/react-query'

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Proxima_Nova_Regular: require('./assets/fonts/Proxima_Nova_Regular.otf'),
    Proxima_Nova_Semibold: require('./assets/fonts/Proxima_Nova_Semibold.otf'),
  })

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync()

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync()
        await Updates.reloadAsync()
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`)
    }
  }

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded || fontError) {
  //     await SplashScreen.hideAsync()
  //   }
  // }, [fontsLoaded, fontError])

  // if (!fontsLoaded && !fontError) {
  //   return null
  // }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    onFetchUpdateAsync()
  }, [])

  return (
    <NativeBaseProvider theme={THEME}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" backgroundColor="transparent" translucent />
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            {fontsLoaded && <Routes />}
          </QueryClientProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </NativeBaseProvider>
  )
}

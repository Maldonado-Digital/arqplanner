import { THEME } from '@theme/index'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { NativeBaseProvider } from 'native-base'
import { useCallback } from 'react'
import { Text, View } from 'react-native'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    MarkPro_Regular: require('./assets/fonts/MarkPro_Regular.otf'),
    MarkPro_Medium: require('./assets/fonts/MarkPro_Medium.otf'),
    MarkPro_Bold: require('./assets/fonts/MarkPro_Bold.otf'),
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar style="dark" />
      <View
        onLayout={onLayoutRootView}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{ fontFamily: 'MarkPro_Bold', fontSize: 30 }}>
          Inter Black
        </Text>
        <Text style={{ fontSize: 30 }}>Platform Default</Text>
      </View>
    </NativeBaseProvider>
  )
}

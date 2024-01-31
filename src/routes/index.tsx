import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { Box, useTheme } from 'native-base'
import { AuthRoutes } from './auth.routes'

export function Routes() {
  const { colors } = useTheme()

  DefaultTheme.colors.background = colors.white

  return (
    <Box flex={1} bg="white">
      <NavigationContainer theme={DefaultTheme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  )
}

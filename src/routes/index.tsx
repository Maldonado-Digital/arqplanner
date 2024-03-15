import { Loading } from '@components/Loading'
import { useAuth } from '@hooks/useAuth'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { Box, useTheme } from 'native-base'
import { AppRoutes } from './app.routes'
import { AuthRoutes } from './auth.routes'

export function Routes() {
  const { colors } = useTheme()
  const { user, isLoadingUserFromStorage } = useAuth()

  DefaultTheme.colors.background = colors.white

  if (isLoadingUserFromStorage) return <Loading />

  return (
    <Box flex={1} bg="white">
      <NavigationContainer theme={DefaultTheme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}

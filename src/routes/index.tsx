import { Loading } from '@components/Loading'
import { useAuth } from '@hooks/useAuth'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { Box, useTheme } from 'native-base'
import { type AppNavigatorRoutesProps, AppRoutes } from './app.routes'
import { type AuthNavigatorRoutesProps, AuthRoutes } from './auth.routes'

export type AllNavigatorRoutesProps = AppNavigatorRoutesProps & AuthNavigatorRoutesProps

export function Routes() {
  const { colors } = useTheme()
  const { user, isLoadingAuthData } = useAuth()

  DefaultTheme.colors.background = colors.white

  if (isLoadingAuthData) return <Loading />

  return (
    <Box flex={1} bg={user.id ? 'muted.50' : 'white'}>
      <NavigationContainer theme={DefaultTheme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}

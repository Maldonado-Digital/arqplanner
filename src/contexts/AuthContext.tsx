import type { UserDTO } from '@dtos/UserDTO'
import {
  getExpirationFromStorage,
  removeExpirationFromStorage,
  saveExpirationInStorage,
} from '@storage/storageExpiration'
import {
  getTokenFromStorage,
  removeTokenFromStorage,
  saveTokenInStorage,
} from '@storage/storageToken'
import {
  getUserFromStorage,
  removeUserFromStorage,
  saveUserInStorage,
} from '@storage/storageUser'
import { AppError } from '@utils/AppError'
import { useToast } from 'native-base'
import { type ReactNode, createContext, useEffect, useState } from 'react'
import { refreshToken } from 'src/api/mutations/refreshToken'
import { api } from 'src/lib/api'

export type AuthContextProps = {
  user: UserDTO
  isLoadingAuthData: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

type SetAuthConfigsDTO = {
  userData: UserDTO
  token: string
}

type SaveAuthConfigsInStorageDTO = {
  userData: UserDTO
  token: string
  exp: number
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

export function AuthProvider({ children }: { children: ReactNode }) {
  const toast = useToast()
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingAuthData, setIsLoadingAuthData] = useState(true)

  async function setAuthConfig({ userData, token }: SetAuthConfigsDTO) {
    api.defaults.headers.common.Authorization = `JWT ${token}`
    setUser(userData)
  }

  async function saveAuthConfigInStorage({
    userData,
    token,
    exp,
  }: SaveAuthConfigsInStorageDTO) {
    setIsLoadingAuthData(true)
    await saveUserInStorage(userData)
    await saveTokenInStorage(token)
    await saveExpirationInStorage(exp)
    setIsLoadingAuthData(false)
  }

  async function signIn(email: string, password: string) {
    const { data } = await api.post<{ user?: UserDTO; token?: string; exp: number }>(
      '/api/customers/login?locale=pt-BR',
      {
        email,
        password,
      },
    )

    if (
      !data.user?.organization?.id ||
      !data.user.works ||
      typeof data.user.works === 'string'
    ) {
      throw new AppError('Erro ao carregar as informações')
    }

    if (data.user && data.token) {
      await saveAuthConfigInStorage({
        userData: data.user,
        token: data.token,
        exp: data.exp,
      })
      setAuthConfig({
        userData: data.user,
        token: data.token,
      })
    }
  }

  async function signOut() {
    setIsLoadingAuthData(true)
    setUser({} as UserDTO)
    await removeUserFromStorage()
    await removeTokenFromStorage()
    await removeExpirationFromStorage()
    setIsLoadingAuthData(false)
  }

  async function loadAuthData() {
    setIsLoadingAuthData(true)

    const loggedUser = await getUserFromStorage()
    const token = await getTokenFromStorage()
    const expiration = await getExpirationFromStorage()

    if (!loggedUser || !token || !expiration) return setIsLoadingAuthData(false)
    if (Math.floor(Date.now() / 1000) > expiration) return setIsLoadingAuthData(false)

    try {
      const { refreshedToken, exp } = await refreshToken({ token })

      await saveAuthConfigInStorage({
        userData: loggedUser,
        token: refreshedToken,
        exp,
      })

      setAuthConfig({
        userData: loggedUser,
        token: refreshedToken,
      })

      setIsLoadingAuthData(false)
    } catch (error) {
      setIsLoadingAuthData(false)
      await signOut()
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    loadAuthData()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoadingAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

import { Toast } from '@components/Toast'
import type { UserDTO } from '@dtos/UserDTO'
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
import { api } from 'src/lib/api'

export type AuthContextProps = {
  user: UserDTO
  isLoadingUserFromStorage: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps,
)

export function AuthProvider({ children }: { children: ReactNode }) {
  const toast = useToast()
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserFromStorage, setIsLoadingUserFromStorage] = useState(true)

  async function updateUserAndToken(userData: UserDTO, token: string) {
    api.defaults.headers.common.Authorization = `JWT ${token}`
    setUser(userData)
  }

  async function updateUserAndTokenInStorage(userData: UserDTO, token: string) {
    try {
      setIsLoadingUserFromStorage(true)
      await saveUserInStorage(userData)
      await saveTokenInStorage(token)
    } catch (error) {
      // biome-ignore lint/complexity/noUselessCatch: <explanation>
      throw error
    } finally {
      setIsLoadingUserFromStorage(false)
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post<{ user?: UserDTO; token?: string }>(
        '/api/customers/login?locale=pt-BR',
        {
          email,
          password,
        },
      )

      console.log(data)

      if (!data.user?.organization?.id || !data.user.works[0]) {
        throw new AppError('Erro ao carregar as informações')
      }

      if (data.user && data.token) {
        await updateUserAndTokenInStorage(data.user, data.token)
        updateUserAndToken(data.user, data.token)
      }
    } catch (error) {
      const isAppError = error instanceof AppError

      if (isAppError) {
        toast.show({
          duration: 3000,
          render: ({ id }) => (
            <Toast
              id={id}
              message="Erro ao carregar as informações"
              status="error"
            />
          ),
        })
      }
    } finally {
      setIsLoadingUserFromStorage(false)
    }
  }

  async function signOut() {
    setIsLoadingUserFromStorage(true)
    setUser({} as UserDTO)
    await removeUserFromStorage()
    await removeTokenFromStorage()
    setIsLoadingUserFromStorage(false)
  }

  async function loadUserData() {
    try {
      setIsLoadingUserFromStorage(true)
      const loggedUser = await getUserFromStorage()
      const token = await getTokenFromStorage()

      if (loggedUser && token) {
        updateUserAndToken(loggedUser, token)
      }
    } catch (error) {
      // biome-ignore lint/complexity/noUselessCatch: <explanation>
      throw error
    } finally {
      setIsLoadingUserFromStorage(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoadingUserFromStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// {
//   email: 'bruno@jab.com',
//   id: '65f06f4a35b7e8add45601ee',
//   name: 'Bruno Jab',
//   works: ['65f06ff035b7e8add4560230'],
//   organization: { id: '65f06e4e35b7e8add4560172', name: 'NB Arquitetura' },
// }

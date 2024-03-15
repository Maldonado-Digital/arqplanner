import AsyncStorage from '@react-native-async-storage/async-storage'
import { TOKEN_STORAGE } from './config'

export async function saveTokenInStorage(token: string) {
  await AsyncStorage.setItem(TOKEN_STORAGE, token)
}

export async function getTokenFromStorage() {
  const storage = await AsyncStorage.getItem(TOKEN_STORAGE)
  return storage
}

export async function removeTokenFromStorage() {
  await AsyncStorage.removeItem(TOKEN_STORAGE)
}

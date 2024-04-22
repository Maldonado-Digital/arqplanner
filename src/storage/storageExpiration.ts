import AsyncStorage from '@react-native-async-storage/async-storage'
import { EXP_STORAGE } from './config'

export async function saveExpirationInStorage(exp: number) {
  await AsyncStorage.setItem(EXP_STORAGE, String(exp))
}

export async function getExpirationFromStorage() {
  const storage = await AsyncStorage.getItem(EXP_STORAGE)

  return storage ? Number(storage) : null
}

export async function removeExpirationFromStorage() {
  await AsyncStorage.removeItem(EXP_STORAGE)
}

import { AppError } from '@utils/AppError'
import axios from 'axios'

const api = axios.create({
  withCredentials: true,
  baseURL: process.env.EXPO_PUBLIC_API_URL,
})

api.interceptors.response.use(
  response => response,
  err => {
    console.log('API Error:', err.response?.data)
    if (err.response?.data) {
      return Promise.reject(new AppError(err.response?.data.errors[0]?.message))
    }

    return Promise.reject(err)
  },
)

export { api }

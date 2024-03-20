import { AppError } from '@utils/AppError'
import axios from 'axios'

const api = axios.create({
  withCredentials: true,
  baseURL: 'https://arqplanner-cms-staging.payloadcms.app',
  // baseURL: 'http://192.168.1.100:3000',
})

api.interceptors.response.use(
  response => response,
  err => {
    console.log(err.response?.data)
    // if (err.response?.data) {
    //   return Promise.reject(new AppError(err.response?.data.errors[0]?.message))
    // }

    return Promise.reject(err)
  },
)

export { api }

// export function apix(path: string, init?: RequestInit) {
//   const baseUrl = 'https://arqplanner-cms-staging.payloadcms.app'
//   const apiPrefix = '/api'
//   const url = new URL(apiPrefix.concat(path), baseUrl)

//   return fetch(url, init)
// }

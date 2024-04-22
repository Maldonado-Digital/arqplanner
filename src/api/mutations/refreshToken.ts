import { api } from 'src/lib/api'

type RefreshTokenDTO = {
  token: string
}

type RefreshTokenResponse = {
  exp: number
  refreshedToken: string
}

export async function refreshToken({ token }: RefreshTokenDTO) {
  const { data } = await api.post<RefreshTokenResponse>('/api/customers/refresh-token', {
    token,
  })

  return data
}

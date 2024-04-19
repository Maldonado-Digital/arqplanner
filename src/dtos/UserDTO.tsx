import type { Work } from 'src/api/queries/getWorks'
import type { OrganizationDTO } from './OrganizationDTO'

export type UserDTO = {
  id: string
  name: string
  email: string
  phone_number?: string
  social_media?: string
  works: Array<string | Work>
  organization: OrganizationDTO
}

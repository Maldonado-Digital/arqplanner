import { api } from 'src/lib/api'

type Step = {
  step: {
    title: string
    is_completed: boolean
  }
  id: string
}

type Event = {
  event: {
    title: string
    description: string
    date: string
    address: string
    professional_name: string
    profession?: string
    contact_number: string
    contact_email?: string
    instagram?: string
  }
  id: string
}

export type Document = {
  document: {
    title: string
    type: 'briefings' | 'contracts' | 'meeting_minutes' | 'other'

    file: {
      id: string
      organization: string
      filename: string
      mimeType: string
      filesize: number
      createdAt: string
      updatedAt: string
      url: string
    }
  }
  id: string
}

export type Project = {
  project: {
    title: string
    status: 'pending' | 'approved' | 'archived'
    type: 'executive' | 'wood_detailing' | 'wet_spaces_detailing'
    file: {
      id: string
      organization: string
      filename: string
      mimeType: string
      filesize: number
      createdAt: string
      updatedAt: string
      url: string
    }
  }
  id: string
}

export type Render = {
  render: {
    title: string
    status: 'pending' | 'approved' | 'archived'
    files: [
      {
        uploads: {
          id: string
          organization: string
          filename: string
          mimeType: string
          filesize: number
          width: number
          height: number
          createdAt: string
          updatedAt: string
          url: string
        }
        id: string
      },
    ]
  }
  id: string
}

export type Photo = {
  photo: {
    title: string
    files: [
      {
        uploads: {
          id: string
          organization: string
          filename: string
          mimeType: string
          filesize: number
          width: number
          height: number
          createdAt: string
          updatedAt: string
          url: string
        }
        id: string
      },
    ]
  }
  id: string
}

type GetWorksResponse = {
  docs: Array<{
    id: string
    title: string
    steps: Array<Step>
    events: Array<Event>
    projects: Array<Project>
    renders: Array<Render>
    documents: Array<Document>
    photos: Array<Photo>
    // quotes: []
    organization: {
      id: string
      name: string
      createdAt: string
      updatedAt: string
    }
    createdAt: string
    updatedAt: string
  }>
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  // prevPage: null
  // nextPage: null
}

export async function getWorks() {
  const response = await api.get<GetWorksResponse>(
    '/api/works?locale=pt-BR&depth=1',
  )

  return response.data
}

import { format } from 'date-fns'
import type {
  ApprovalStatus,
  Document,
  FileType,
  MediaFileType,
  Photo,
  Project,
  Quote,
  Render,
  Work,
} from 'src/api/queries/getWorks'
import { AppError } from './AppError'

export function getInitials(name: string) {
  const splitted = name.trim().split(' ')
  if (!splitted.length || !splitted[0].length) return 'n/a'

  if (splitted.length === 1) {
    return `${splitted[0][0]}${splitted[0][1] ?? ''}`
  }

  return `${splitted[0][0]}${splitted[1][0] ?? ''}`
}

export function getFullName(name: string) {
  const splitted = name.trim().split(' ')
  if (!splitted.length || !splitted[0].length) return 'Nenhum \nnome'

  if (splitted.length === 1) {
    return splitted[0]
  }

  return splitted.slice(0, 2).join(' ')
}

export function phoneMask(value: string) {
  const match = value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/)

  if (!match) return value

  return !match[2]
    ? match[1]
    : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`
}

type ViewingDocumentData = {
  title: string
  subTitle: string
  file: FileType
  status: ApprovalStatus | null
}

type ViewingMediaData = {
  title: string
  subTitle: string
  files: MediaFileType[]
  status: ApprovalStatus | null
}

export type ViewableDocumentTypes = 'project' | 'document' | 'quote'

export type ViewableMediaTypes = 'render' | 'photo'

type GetViewingDocumentDataReturnType = {
  data: ViewingDocumentData | null
}

type DocumentTypesFactory = {
  [k in ViewableDocumentTypes]: () => GetViewingDocumentDataReturnType
}

type GetViewingMediaDataReturnType = {
  data: ViewingMediaData | null
}

type MediaTypesFactory = {
  [k in ViewableMediaTypes]: () => GetViewingMediaDataReturnType
}

export function digViewingDocumentData(
  work: Work,
  documentType: ViewableDocumentTypes,
  id: string,
) {
  const getProjectViewData = () => {
    const project = work.projects.find(p => p.id === id)

    if (!project) return { data: null }

    const data = {
      title: project.project.title,
      subTitle: format(project.project.file.updatedAt, "dd-MM-yy' | 'HH:mm"),
      file: project.project.file,
      status: project.project.status,
    }

    return { data }
  }

  const getDocumentViewData = () => {
    const document = work.documents.find(d => d.id === id)

    if (!document) return { data: null }

    const data = {
      title: document.document.title,
      subTitle: format(document.document.file.updatedAt, "dd-MM-yy' | 'HH:mm"),
      file: document.document.file,
      status: null,
    }

    return { data }
  }

  const getQuoteViewData = () => {
    const quote = work.quotes.find(quote => quote.id === id)

    if (!quote) return { data: null }

    const data = {
      title: quote.quote.title,
      subTitle: format(quote.quote.file.updatedAt, "dd-MM-yy' | 'HH:mm"),
      file: quote.quote.file,
      status: null,
    }

    return { data }
  }

  const documentTypesFactory: DocumentTypesFactory = {
    project: getProjectViewData,
    document: getDocumentViewData,
    quote: getQuoteViewData,
  }

  const fn = documentTypesFactory[documentType]
  return fn()
}

export function digViewingMediaData(
  work: Work,
  mediaType: ViewableMediaTypes,
  id: string,
) {
  const getRenderViewData = () => {
    const render = work.renders.find(r => r.id === id)

    if (!render) return { data: null }

    const data = {
      title: render.render.title,
      subTitle: format(render.render.files[0].uploads.updatedAt, "dd-MM-yy' | 'HH:mm"),
      files: render.render.files,
      status: render.render.status,
    }

    return { data }
  }

  const getPhotoViewData = () => {
    const photo = work.photos.find(p => p.id === id)

    if (!photo) return { data: null }

    const data = {
      title: photo.photo.title,
      subTitle: format(photo.photo.files[0].uploads.updatedAt, "dd-MM-yy' | 'HH:mm"),
      files: photo.photo.files,
      status: null,
    }

    return { data }
  }

  const mediaTypesFactory: MediaTypesFactory = {
    render: getRenderViewData,
    photo: getPhotoViewData,
  }

  const fn = mediaTypesFactory[mediaType]
  return fn()
}

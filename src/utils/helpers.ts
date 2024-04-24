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

type DocumentTypesFactory = {
  [k in ViewableDocumentTypes]: () => ViewingDocumentData
}

type MediaTypesFactory = {
  [k in ViewableMediaTypes]: () => ViewingMediaData
}

export function digViewingDocumentData(
  work: Work,
  documentType: ViewableDocumentTypes,
  id: string,
) {
  const getProjectViewData = () => {
    const { project } = work.projects.find(p => p.id === id) as Project
    return {
      title: project.title,
      subTitle: format(project.file.updatedAt, "dd-MM-yy' | 'HH:mm"),
      file: project.file,
      status: project.status,
    }
  }

  const getDocumentViewData = () => {
    const { document } = work.documents.find(d => d.id === id) as Document
    return {
      title: document.title,
      subTitle: format(document.file.updatedAt, "dd-MM-yy' | 'HH:mm"),
      file: document.file,
      status: null,
    }
  }

  const getQuoteViewData = () => {
    const { quote } = work.quotes.find(quote => quote.id === id) as Quote
    return {
      title: quote.title,
      subTitle: format(quote.file.updatedAt, "dd-MM-yy' | 'HH:mm"),
      file: quote.file,
      status: null,
    }
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
    const { render } = work.renders.find(r => r.id === id) as Render
    return {
      title: render.title,
      subTitle: format(render.files[0].uploads.updatedAt, "dd-MM-yy' | 'HH:mm"),
      files: render.files,
      status: render.status,
    }
  }

  const getPhotoViewData = () => {
    const { photo } = work.photos.find(p => p.id === id) as Photo
    return {
      title: photo.title,
      subTitle: format(photo.files[0].uploads.updatedAt, "dd-MM-yy' | 'HH:mm"),
      files: photo.files,
      status: null,
    }
  }

  const mediaTypesFactory: MediaTypesFactory = {
    render: getRenderViewData,
    photo: getPhotoViewData,
  }

  const fn = mediaTypesFactory[mediaType]
  return fn()
}

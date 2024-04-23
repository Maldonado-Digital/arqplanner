import { format } from 'date-fns'
import type {
  Document,
  FileType,
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
  status: 'pending' | 'approved' | 'archived' | null
}

export type ViewableDocumentTypes = 'project' | 'document' | 'quote'

type DocumentTypesFactory = {
  [k in ViewableDocumentTypes]: () => ViewingDocumentData
}

export function digViewingDocumentData(
  work: Work,
  documentType: ViewableDocumentTypes,
  id: string,
) {
  const getProjectViewData = () => {
    const project = work.projects.find(p => p.id === id) as Project
    return {
      title: project.project.title,
      subTitle: format(project.project.file.updatedAt, "dd-MM-yy' | 'H:mm"),
      file: project.project.file,
      status: project.project.status,
    }
  }

  const getDocumentViewData = () => {
    const document = work.documents.find(d => d.id === id) as Document
    return {
      title: document.document.title,
      subTitle: format(document.document.file.updatedAt, "dd-MM-yy' | 'H:mm"),
      file: document.document.file,
      status: null,
    }
  }

  const getQuoteViewData = () => {
    const quote = work.quotes.find(quote => quote.id === id) as Quote
    return {
      title: quote.quote.title,
      subTitle: format(quote.quote.file.updatedAt, "dd-MM-yy' | 'H:mm"),
      file: quote.quote.file,
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

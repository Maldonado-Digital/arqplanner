import { Platform } from 'react-native'
import type { ProjectType } from 'src/api/queries/getWorks'

import { CADFileIconSvg } from '@components/svgs/CADFileIconSvg'
import { DOCFileIconSvg } from '@components/svgs/DOCFileIconSvg'
import { PDFFileIconSvg } from '@components/svgs/PDFFileIconSvg'
import { PPTFileIconSvg } from '@components/svgs/PPTFIleIconSvg'
import { XLSFileIconSvg } from '@components/svgs/XLSFileIconSvg'

export const statusBarHeight = Platform.OS === 'android' ? 4 : 12

export const statusColor = {
  pending: '#F8C40E26',
  approved: '#0AAF8726',
  archived: '#00000012',
}

export const projectTypes: Record<ProjectType, string> = {
  executive: 'Executivo',
  wet_spaces_detailing: 'Detalhamento Áreas Molhadas',
  wood_detailing: 'Detalhamento Marcenaria',
}

export const calendarEventColors = [
  '#0F25EE',
  '#F8C40E',
  '#FF38A4',
  '#AD00FF',
  '#ED254E',
  '#0AAF87',
  '#FC2F00',
]

export const documentsCategories = [
  {
    label: 'Todos',
    value: 'all',
  },
  {
    label: 'Propostas',
    value: 'offers',
  },
  {
    label: 'Briefings',
    value: 'briefings',
  },
  {
    label: 'Contratos',
    value: 'contracts',
  },
  {
    label: 'Atas de Reunião',
    value: 'meeting_minutes',
  },
  {
    label: 'Outros',
    value: 'other',
  },
]

export const approvalStatus = [
  {
    singular: 'Todos',
    plural: 'Todos',
    value: 'all',
  },
  {
    singular: 'Aprovado',
    plural: 'Aprovados',
    value: 'approved',
  },
  {
    singular: 'Pendente',
    plural: 'Pendentes',
    value: 'pending',
  },
  {
    singular: 'Arquivado',
    plural: 'Arquivados',
    value: 'archived',
  },
]

export const FILE_EXTENSION_ICON_MAP = {
  pdf: PDFFileIconSvg,
  dwg: CADFileIconSvg,
  doc: DOCFileIconSvg,
  docx: DOCFileIconSvg,
  xls: XLSFileIconSvg,
  xlsx: XLSFileIconSvg,
  pptx: PPTFileIconSvg,
}
export const PDF_MIME_TYPE = 'application/pdf'
export const NOT_ALLOWED_API_ERROR_MESSAGE = 'You are not allowed to perform this action.'

import { Platform } from 'react-native'

export const statusBarHeight = Platform.OS === 'android' ? 4 : 12

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

export const projectStatus = [
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

import { api } from 'src/lib/api'

type ResolveProjectDTO = {
  workId: string
  projectId: string
  status: 'approved' | 'archived'
}

export async function resolveProject({ workId, projectId, status }: ResolveProjectDTO) {
  const { data } = await api.patch(
    `/api/works/${workId}/resolve-project/${projectId}?locale=pt-BR`,
    {
      status,
    },
  )

  return data
}

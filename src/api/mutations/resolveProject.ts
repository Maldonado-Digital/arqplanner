import { api } from 'src/lib/api'

export type ResolveProjectDTO = {
  workId: string
  projectId: string
  status: 'approved' | 'archived'
  comments: string
}

export async function resolveProject({
  workId,
  projectId,
  status,
  comments,
}: ResolveProjectDTO) {
  await new Promise(resolve => setTimeout(resolve, 1000))
  const { data } = await api.patch(
    `/api/works/${workId}/resolve-project/${projectId}?locale=pt-BR`,
    {
      status,
      comments,
    },
  )

  return data
}

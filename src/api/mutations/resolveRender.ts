import { api } from 'src/lib/api'

export type ResolveRenderDTO = {
  workId: string
  renderId: string
  status: 'approved' | 'archived'
  comments: string
}

export async function resolveRender({
  workId,
  renderId,
  status,
  comments,
}: ResolveRenderDTO) {
  await new Promise(resolve => setTimeout(resolve, 300))
  const { data } = await api.patch(
    `/api/works/${workId}/resolve-render/${renderId}?locale=pt-BR`,
    {
      status,
      comments,
    },
  )

  return data
}

import { useCallback, useState } from 'react'

export function useRefresh<T>(refetch: () => Promise<T>) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    await refetch()
    setRefreshing(false)
  }, [refetch])

  return { refreshing, handleRefresh }
}

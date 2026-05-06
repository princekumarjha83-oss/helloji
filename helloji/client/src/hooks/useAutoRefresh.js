import { useState, useEffect, useCallback } from 'react'

export const useAutoRefresh = (refreshFunction, interval = 5000, enabled = true) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [error, setError] = useState(null)

  const manualRefresh = useCallback(async () => {
    if (!refreshFunction) return
    
    setIsRefreshing(true)
    setError(null)
    
    try {
      await refreshFunction()
      setLastRefresh(new Date())
    } catch (err) {
      setError(err.message || 'Refresh failed')
    } finally {
      setIsRefreshing(false)
    }
  }, [refreshFunction])

  useEffect(() => {
    if (!enabled || !refreshFunction) return

    const intervalId = setInterval(() => {
      manualRefresh()
    }, interval)

    // Initial refresh
    manualRefresh()

    return () => clearInterval(intervalId)
  }, [enabled, interval, refreshFunction, manualRefresh])

  return {
    isRefreshing,
    lastRefresh,
    error,
    manualRefresh
  }
}

export default useAutoRefresh

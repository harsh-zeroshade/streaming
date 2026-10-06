import { useLocalStorage } from './useLocalStorage'

/**
 * Track and manage continue-watching progress.
 * Each entry: { id, type, title, poster, backdrop, progress (0-100),
 *              progressSeconds, durationMinutes, episodeId, season, episode }
 */
export const useContinueWatching = () => {
  const [watchHistory, setWatchHistory] = useLocalStorage('nova_watch_history', [])

  const getProgress = (id) => watchHistory.find((item) => item.id === id) || null

  const updateProgress = (contentData, progressSeconds, durationMinutes) => {
    const progress = durationMinutes > 0
      ? Math.min(100, Math.round((progressSeconds / (durationMinutes * 60)) * 100))
      : 0

    setWatchHistory((prev) => {
      const existing = prev.findIndex((item) => item.id === contentData.id)
      const entry = {
        ...contentData,
        progressSeconds,
        durationMinutes,
        progress,
        updatedAt: Date.now(),
      }
      if (existing !== -1) {
        const updated = [...prev]
        updated[existing] = entry
        return updated
      }
      return [entry, ...prev]
    })
  }

  const removeFromHistory = (id) => {
    setWatchHistory((prev) => prev.filter((item) => item.id !== id))
  }

  // Filter out items that are > 95% complete
  const continueWatching = watchHistory.filter((item) => item.progress < 95)

  return { continueWatching, getProgress, updateProgress, removeFromHistory }
}

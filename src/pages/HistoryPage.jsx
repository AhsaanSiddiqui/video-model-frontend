import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import VideoCard from '../components/home/VideoCard.jsx'
import { NoVideosFound } from '../components/empty/NoVideosFound.jsx'
import { fetchWatchHistory } from '../api/auth.api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { mapVideoToCard } from '../utils/videoFormat.js'

export default function HistoryPage() {
  const { isAuthenticated } = useAuth()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false

    async function load() {
      setLoading(true)
      const result = await fetchWatchHistory()
      if (cancelled) return
      if (!result.success) {
        setError(result.message)
        setVideos([])
      } else {
        setVideos(result.videos.map(mapVideoToCard))
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (loading) {
    return (
      <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="aspect-video animate-pulse bg-play-surface-elevated" />
        ))}
      </div>
    )
  }

  if (error) {
    return <NoVideosFound title="Could not load history" description={error} />
  }

  if (!videos.length) {
    return (
      <NoVideosFound
        title="No watch history"
        description="Videos you watch will show up here, newest first."
      />
    )
  }

  return (
    <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.id} {...video} />
      ))}
    </div>
  )
}

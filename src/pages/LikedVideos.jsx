import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import VideoCard from '../components/home/VideoCard.jsx'
import { NoVideosFound } from '../components/empty/NoVideosFound.jsx'
import { fetchLikedVideos } from '../api/like.api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { mapVideoToCard } from '../utils/videoFormat.js'
import { LoadingSpinner } from '../components/Loader.jsx'

export default function LikedVideos() {
  const { isAuthenticated } = useAuth()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false

    async function load() {
      setLoading(true)
      const result = await fetchLikedVideos()
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

  if (loading) return <LoadingSpinner />

  if (error) {
    return <NoVideosFound title="Could not load liked videos" description={error} />
  }

  if (!videos.length) {
    return (
      <NoVideosFound
        title="No liked videos"
        description="Videos you like will show up here."
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

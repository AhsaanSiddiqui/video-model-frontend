import { useCallback, useEffect, useState } from 'react'
import VideoCard from '../components/home/VideoCard.jsx'
import { NoVideosFound } from '../components/empty/NoVideosFound.jsx'
import { fetchVideos } from '../api/video.api.js'
import { mapVideoToCard } from '../utils/videoFormat.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadVideos = useCallback(async () => {
    if (!isAuthenticated) {
      setVideos([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const result = await fetchVideos({ page: 1, limit: 24 })

    if (!result.success) {
      setError(result.message || 'Could not load videos')
      setVideos([])
    } else {
      setVideos(result.videos.map(mapVideoToCard))
    }

    setLoading(false)
  }, [isAuthenticated])

  useEffect(() => {
    loadVideos()
  }, [loadVideos])

  if (!isAuthenticated) {
    return (
      <NoVideosFound
        title="Sign in to watch videos"
        description="Log in to browse uploaded videos from creators across the platform."
      />
    )
  }

  if (loading) {
    return (
      <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-video rounded-sm bg-play-surface-elevated" />
            <div className="mt-3 flex gap-3">
              <div className="size-9 rounded-full bg-play-surface-elevated" />
              <div className="flex-1 space-y-2">
                <div className="h-4 rounded bg-play-surface-elevated" />
                <div className="h-3 w-2/3 rounded bg-play-surface-elevated" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <section className="mx-auto flex min-h-64 max-w-xl flex-col items-center justify-center text-center">
        <p className="text-lg text-play-muted">{error}</p>
        <button
          type="button"
          onClick={loadVideos}
          className="mt-4 rounded-play-button bg-play-primary px-5 py-2 text-sm font-semibold text-play-primary-foreground hover:bg-play-primary-hover"
        >
          Try again
        </button>
      </section>
    )
  }

  if (!videos.length) {
    return (
      <NoVideosFound
        title="No videos yet"
        description="Uploaded videos from creators will appear here. Upload from your profile to get started."
      />
    )
  }

  return (
    <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.id ?? video.title} {...video} />
      ))}
    </div>
  )
}

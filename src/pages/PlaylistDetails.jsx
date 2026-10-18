import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { IconChevronDown } from '../components/icons/OutlineIcons.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchPlaylistById } from '../api/playlist.api.js'
import { formatTimeAgo, mapPlaylistCard, mapVideoToCard } from '../utils/videoFormat.js'

export default function PlaylistDetails() {
  const { isAuthenticated, user } = useAuth()
  const { playlistId } = useParams()
  const [playlist, setPlaylist] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !playlistId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      const result = await fetchPlaylistById(playlistId)
      if (cancelled) return

      if (!result.success || !result.playlist) {
        setPlaylist(null)
        setVideos([])
        setError(result.message || 'Playlist not found')
      } else {
        const items = (result.playlist.videos ?? []).filter((video) => video && typeof video === 'object')
        setPlaylist(result.playlist)
        setVideos(items.map(mapVideoToCard))
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, playlistId])

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (loading) {
    return (
      <div className="mx-auto grid w-full max-w-[1920px] animate-pulse grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="aspect-video bg-play-surface-elevated" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 bg-play-surface-elevated" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !playlist) {
    return (
      <section className="mx-auto flex min-h-64 max-w-xl flex-col items-center justify-center text-center">
        <p className="text-lg text-play-muted">{error || 'Playlist not found'}</p>
        <Link to="/profile" className="mt-4 text-play-primary hover:underline">
          Back to profile
        </Link>
      </section>
    )
  }

  const card = mapPlaylistCard(playlist)
  const owner = playlist.owner && typeof playlist.owner === 'object' ? playlist.owner : user
  const ownerId = owner?._id ?? playlist.owner
  const isOwner = Boolean(user?._id && ownerId && String(user._id) === String(ownerId))
  const avatar =
    typeof owner?.avatar === 'string' && /^https?:\/\//i.test(owner.avatar.trim())
      ? owner.avatar.trim()
      : 'https://i.pravatar.cc/120?img=33'

  return (
    <div className="mx-auto grid w-full max-w-[1920px] grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1fr]">
      <section>
        <div className="mb-3 flex justify-end">
          {isOwner ? (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-play-button bg-play-primary px-4 py-2 text-sm font-semibold text-play-primary-foreground hover:bg-play-primary-hover"
            >
              <span aria-hidden>✎</span>
              Edit
            </button>
          ) : null}
        </div>
        <article>
          <div className="relative aspect-video overflow-hidden border border-play-border-subtle bg-play-surface-elevated">
            {card.thumbnail ? (
              <img src={card.thumbnail} alt="" className="h-full w-full object-cover" />
            ) : null}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/85 via-black/45 to-transparent" />
            <div className="absolute bottom-4 left-5">
              <p className="text-md font-semibold text-play-foreground">Playlist</p>
              <p className="mt-1 text-md text-play-foreground">
                {card.views} • {formatTimeAgo(playlist.updatedAt || playlist.createdAt)}
              </p>
            </div>
            <div className="absolute bottom-4 right-5 text-md font-semibold text-play-foreground">
              {videos.length} video{videos.length === 1 ? '' : 's'}
            </div>
          </div>
          <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-play-foreground">
            {playlist.name}
          </h1>
          {playlist.description ? (
            <p className="mt-2 text-sm text-play-muted">{playlist.description}</p>
          ) : (
            <button
              type="button"
              className="mt-1 inline-flex items-center gap-2 text-play-muted hover:text-play-foreground"
            >
              <IconChevronDown />
            </button>
          )}
        </article>

        <div className="mt-12 flex items-center gap-3 border-t border-play-border-subtle pt-4">
          <img src={avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
          <div>
            <p className="text-xl font-semibold text-play-foreground">
              {owner?.fullName || user.fullName || 'Channel'}
            </p>
            {owner?.username ? <p className="text-sm text-play-muted">@{owner.username}</p> : null}
          </div>
        </div>
      </section>

      <section className="space-y-2">
        {videos.length ? (
          videos.map((video) => (
            <Link
              key={video.id}
              to={`/video/${video.id}`}
              className="flex gap-2 border border-play-border-subtle p-1.5 no-underline"
            >
              <img src={video.thumbnail} alt="" className="h-20 w-40 shrink-0 object-cover" />
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-md font-semibold leading-tight text-play-foreground">
                  {video.title}
                </h3>
                <p className="mt-1 text-sm text-play-muted">{video.channel}</p>
                <p className="text-sm text-play-muted">
                  {video.views} Views • {video.uploadedAgo}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="py-8 text-center text-play-muted">No videos saved in this playlist yet.</p>
        )}
      </section>
    </div>
  )
}

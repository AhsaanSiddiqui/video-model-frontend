import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { IconChevronDown } from '../components/icons/OutlineIcons.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { deletePlaylist, fetchPlaylistById, removeVideoFromPlaylist, updatePlaylist } from '../api/playlist.api.js'
import { formatTimeAgo, mapPlaylistCard, mapVideoToCard } from '../utils/videoFormat.js'

export default function PlaylistDetails() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const { playlistId } = useParams()
  const [playlist, setPlaylist] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState(null)
  const [actionError, setActionError] = useState('')
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

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

  async function handleRemove(videoId) {
    if (!playlistId || removingId) return
    setRemovingId(videoId)
    setActionError('')

    const result = await removeVideoFromPlaylist(videoId, playlistId)
    if (!result.success) {
      setActionError(result.message || 'Failed to remove video from playlist')
    } else {
      setVideos((prev) => prev.filter((video) => video.id !== videoId))
      setPlaylist((prev) =>
        prev
          ? {
              ...prev,
              videos: (prev.videos ?? []).filter((video) => String(video?._id ?? video) !== String(videoId)),
            }
          : prev,
      )
    }
    setRemovingId(null)
  }

  function startEdit() {
    setName(playlist?.name || '')
    setDescription(playlist?.description || '')
    setEditing(true)
    setActionError('')
  }

  async function handleSave(event) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || saving) return
    setSaving(true)
    setActionError('')
    const result = await updatePlaylist(playlistId, { name: trimmed, description: description.trim() })
    if (!result.success) {
      setActionError(result.message || 'Failed to update playlist')
    } else {
      setPlaylist((prev) =>
        prev ? { ...prev, name: trimmed, description: description.trim() } : prev,
      )
      setEditing(false)
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (deleting) return
    setDeleting(true)
    setActionError('')
    const result = await deletePlaylist(playlistId)
    if (!result.success) {
      setActionError(result.message || 'Failed to delete playlist')
      setDeleting(false)
      return
    }
    navigate('/collection', { replace: true })
  }

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
        <div className="mb-3 flex justify-end gap-2">
          {isOwner ? (
            <>
              <button
                type="button"
                onClick={editing ? () => setEditing(false) : startEdit}
                className="inline-flex items-center gap-2 rounded-play-button bg-play-primary px-4 py-2 text-sm font-semibold text-play-primary-foreground hover:bg-play-primary-hover"
              >
                <span aria-hidden>✎</span>
                {editing ? 'Cancel' : 'Edit'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!confirmDelete) {
                    setConfirmDelete(true)
                    return
                  }
                  handleDelete()
                }}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-play-button border border-play-border-subtle px-4 py-2 text-sm font-semibold text-play-foreground hover:bg-play-surface-elevated disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : confirmDelete ? 'Confirm delete' : 'Delete'}
              </button>
            </>
          ) : null}
        </div>
        {editing ? (
          <form onSubmit={handleSave} className="mb-4 grid gap-3">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-play-input border border-play-border bg-white px-4 py-3 text-sm text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-play-ring"
            />
            <textarea
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Description"
              className="w-full resize-none rounded-play-input border border-play-border bg-white px-4 py-3 text-sm text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-play-ring"
            />
            {actionError ? <p className="text-sm text-red-400">{actionError}</p> : null}
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="w-fit rounded-play-button bg-play-primary px-4 py-2 text-sm font-semibold text-play-primary-foreground disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </form>
        ) : null}
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
        {actionError ? <p className="text-sm text-red-400">{actionError}</p> : null}
        {videos.length ? (
          videos.map((video) => (
            <div key={video.id} className="flex items-center gap-2 border border-play-border-subtle p-1.5">
              <Link to={`/video/${video.id}`} className="flex min-w-0 flex-1 gap-2 no-underline">
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
              {isOwner ? (
                <button
                  type="button"
                  onClick={() => handleRemove(video.id)}
                  disabled={removingId === video.id}
                  className="shrink-0 rounded-play-button border border-play-border-subtle px-3 py-2 text-sm font-medium text-play-foreground hover:bg-play-surface-elevated disabled:opacity-60"
                >
                  {removingId === video.id ? 'Removing…' : 'Remove'}
                </button>
              ) : null}
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-play-muted">No videos saved in this playlist yet.</p>
        )}
      </section>
    </div>
  )
}

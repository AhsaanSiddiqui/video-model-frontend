import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  addVideoToPlaylist,
  createPlaylist,
  fetchUserPlaylists,
  removeVideoFromPlaylist,
} from '../../api/playlist.api.js'

function playlistHasVideo(playlist, videoId) {
  return (playlist.videos ?? []).some((v) => String(v?._id ?? v) === String(videoId))
}

export function PlaylistModal({ open, videoId, onClose }) {
  useEffect(() => {
    if (!open) return

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  // Mounted only while open, so playlists are re-fetched every time it opens
  return <PlaylistModalContent videoId={videoId} onClose={onClose} />
}

function PlaylistModalContent({ videoId, onClose }) {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [pendingIds, setPendingIds] = useState(new Set())
  const [error, setError] = useState('')
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!user?._id) return
    let cancelled = false

    async function load() {
      const result = await fetchUserPlaylists(user._id)
      if (cancelled) return

      if (!result.success) {
        setError(result.message)
      } else {
        setPlaylists(result.playlists)
        setSelected(
          new Set(result.playlists.filter((p) => playlistHasVideo(p, videoId)).map((p) => p._id)),
        )
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [user?._id, videoId])

  function setPending(playlistId, isPending) {
    setPendingIds((prev) => {
      const next = new Set(prev)
      if (isPending) next.add(playlistId)
      else next.delete(playlistId)
      return next
    })
  }

  function setChecked(playlistId, checked) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(playlistId)
      else next.delete(playlistId)
      return next
    })
  }

  async function togglePlaylist(playlistId) {
    if (pendingIds.has(playlistId)) return
    const wasChecked = selected.has(playlistId)

    setError('')
    setPending(playlistId, true)
    setChecked(playlistId, !wasChecked)

    const result = wasChecked
      ? await removeVideoFromPlaylist(videoId, playlistId)
      : await addVideoToPlaylist(videoId, playlistId)

    if (!result.success) {
      setChecked(playlistId, wasChecked)
      setError(result.message)
    }
    setPending(playlistId, false)
  }

  async function handleCreate(event) {
    event.preventDefault()
    const name = newPlaylistName.trim()
    if (!name || creating) return

    setCreating(true)
    setError('')

    const created = await createPlaylist({ name })
    if (!created.success || !created.playlist?._id) {
      setError(created.message || 'Failed to create playlist')
      setCreating(false)
      return
    }

    // A playlist created from here starts with this video in it
    const playlistId = created.playlist._id
    setPlaylists((prev) => [...prev, created.playlist])
    setNewPlaylistName('')

    const added = await addVideoToPlaylist(videoId, playlistId)
    if (added.success) {
      setChecked(playlistId, true)
    } else {
      setError(added.message)
    }
    setCreating(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 py-8 backdrop-blur-[1px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Save to playlist"
    >
      <div className="w-full max-w-104 rounded-[20px] border border-play-border-subtle bg-play-canvas p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-play-foreground sm:text-xl">Save To playlist</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-3xl leading-none text-play-foreground hover:bg-play-surface-elevated"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {loading ? (
          <ul className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index} className="h-5 w-2/3 animate-pulse rounded bg-play-surface-elevated" />
            ))}
          </ul>
        ) : playlists.length ? (
          <ul className="mt-8 max-h-64 space-y-4 overflow-y-auto">
            {playlists.map((playlist) => (
              <li key={playlist._id}>
                <label className="flex cursor-pointer items-center gap-3 text-xl font-semibold text-play-foreground sm:text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-play-primary"
                    checked={selected.has(playlist._id)}
                    disabled={pendingIds.has(playlist._id)}
                    onChange={() => togglePlaylist(playlist._id)}
                  />
                  <span>{playlist.name}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-sm text-play-muted">
            You don&apos;t have any playlists yet. Create one below.
          </p>
        )}

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

        <form onSubmit={handleCreate} className="mt-8">
          <label htmlFor="playlist-name" className="mb-2 block text-sm font-medium text-play-foreground">
            Name
          </label>
          <input
            id="playlist-name"
            type="text"
            placeholder="Enter playlist name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            disabled={creating}
            className="w-full rounded-play-input border border-play-border bg-white px-4 py-3 text-md text-slate-700 placeholder:text-slate-400 outline-none focus-visible:ring-2 focus-visible:ring-play-ring sm:text-sm"
          />

          <button
            type="submit"
            disabled={creating || !newPlaylistName.trim()}
            className="mt-8 w-full rounded-play-button bg-play-primary px-4 py-3 text-md font-bold text-play-primary-foreground hover:bg-play-primary-hover disabled:opacity-50 sm:text-md"
          >
            {creating ? 'Creating…' : 'Create new Playlist'}
          </button>
        </form>
      </div>
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { createPlaylist, fetchUserPlaylists } from '../api/playlist.api.js'
import { mapPlaylistCard } from '../utils/videoFormat.js'
import { ProfilePlaylistsTab } from '../components/profile/ProfilePlaylistsTab.jsx'

export default function CollectionPage() {
  const { isAuthenticated, user } = useAuth()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)

  const loadPlaylists = useCallback(async () => {
    if (!user?._id) {
      setPlaylists([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    const result = await fetchUserPlaylists(user._id)
    if (!result.success) {
      setPlaylists([])
      setError(result.message)
    } else {
      setPlaylists(result.playlists.map(mapPlaylistCard))
    }
    setLoading(false)
  }, [user?._id])

  useEffect(() => {
    if (!isAuthenticated) return
    loadPlaylists()
  }, [isAuthenticated, loadPlaylists])

  async function handleCreate(event) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || creating) return

    setCreating(true)
    setError('')
    const result = await createPlaylist({ name: trimmed, description: description.trim() })
    if (!result.success) {
      setError(result.message || 'Failed to create playlist')
    } else {
      setName('')
      setDescription('')
      await loadPlaylists()
    }
    setCreating(false)
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="mx-auto max-w-[1920px]">
      <h1 className="text-2xl font-bold tracking-tight text-play-foreground">Collection</h1>
      <p className="mt-2 max-w-xl text-sm text-play-muted">Playlists you create show up here.</p>

      <form onSubmit={handleCreate} className="mt-6 grid max-w-xl gap-3">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Playlist name"
          className="w-full rounded-play-input border border-play-border bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-play-ring"
        />
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description (optional)"
          className="w-full rounded-play-input border border-play-border bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-play-ring"
        />
        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="w-fit rounded-play-button bg-play-primary px-4 py-2 text-sm font-semibold text-play-primary-foreground hover:bg-play-primary-hover disabled:opacity-50"
        >
          {creating ? 'Creating…' : 'Create playlist'}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="aspect-video animate-pulse bg-play-surface-elevated" />
            ))}
          </div>
        ) : error && !playlists.length ? null : (
          <ProfilePlaylistsTab playlists={playlists} />
        )}
      </div>
    </div>
  )
}

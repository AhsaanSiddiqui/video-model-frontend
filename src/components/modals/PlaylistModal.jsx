import { useEffect, useState } from 'react'

const DEFAULT_PLAYLISTS = [
  'Beat MODE',
  'Ill Lyricist',
  'HYPEBEAST',
  'Good Vibes',
  'Rap Caviar',
]

export function PlaylistModal({ open, onClose }) {
  const [selected, setSelected] = useState(new Set(['Beat MODE', 'Ill Lyricist', 'Good Vibes', 'Rap Caviar']))
  const [newPlaylistName, setNewPlaylistName] = useState('')

  useEffect(() => {
    if (!open) return

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  function togglePlaylist(name) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
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

        <ul className="mt-8 space-y-4">
          {DEFAULT_PLAYLISTS.map((name) => {
            const checked = selected.has(name)
            return (
              <li key={name}>
                <label className="flex cursor-pointer items-center gap-3 text-xl font-semibold text-play-foreground sm:text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-play-primary"
                    checked={checked}
                    onChange={() => togglePlaylist(name)}
                  />
                  <span>{name}</span>
                </label>
              </li>
            )
          })}
        </ul>

        <div className="mt-8">
          <label htmlFor="playlist-name" className="mb-2 block text-sm font-medium text-play-foreground">
            Name
          </label>
          <input
            id="playlist-name"
            type="text"
            placeholder="Enter playlist name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="w-full rounded-play-input border border-play-border bg-white px-4 py-3 text-md text-slate-700 placeholder:text-slate-400 outline-none focus-visible:ring-2 focus-visible:ring-play-ring sm:text-sm"
          />
        </div>

        <button
          type="button"
          className="mt-8 w-full rounded-play-button bg-play-primary px-4 py-3 text-md font-bold text-play-primary-foreground hover:bg-play-primary-hover sm:text-md"
        >
          Create new Playlist
        </button>
      </div>
    </div>
  )
}

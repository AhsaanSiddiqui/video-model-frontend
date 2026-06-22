import { Link } from 'react-router-dom'
import { IconFolder } from '../icons/OutlineIcons.jsx'

export function ProfilePlaylistsTab({ playlists }) {
  if (!playlists?.length) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-play-primary/60 bg-play-surface-elevated">
          <IconFolder className="text-play-primary" />
        </div>
        <h3 className="text-3xl font-semibold text-play-foreground">No libraries created</h3>
        <p className="mt-2 max-w-md text-xl leading-relaxed text-play-muted">
          there are no playlists inside this library
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {playlists.map((playlist) => (
          <Link key={playlist.id} to={`/playlist/${playlist.id}`} className="group block cursor-pointer">
            <div className="relative aspect-video overflow-hidden border border-play-border-subtle">
              <img
                src={playlist.thumbnail}
                alt=""
                className="h-full w-full object-cover transition group-hover:opacity-90"
              />
              <span className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-lg text-play-foreground">
                {playlist.videos}
              </span>
            </div>
            <h3 className="mt-3 text-xl font-semibold leading-snug text-play-foreground">{playlist.title}</h3>
            <p className="mt-1 text-md text-play-muted">
              {playlist.views} • {playlist.uploadedAgo}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

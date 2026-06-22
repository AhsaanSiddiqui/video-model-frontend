import { Navigate, useParams } from 'react-router-dom'
import { IconChevronDown } from '../components/icons/OutlineIcons.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getPlaylistById, playlistDetailVideos } from '../data/profileMock.js'

export default function PlaylistDetails() {
  const { isAuthenticated, user } = useAuth()
  const { playlistId } = useParams()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const playlist = getPlaylistById(playlistId)
  const profileAvatar =
    typeof user.avatar === 'string' && /^https?:\/\//i.test(user.avatar.trim())
      ? user.avatar.trim()
      : 'https://i.pravatar.cc/120?img=33'
  const isOwner =
    typeof user.username === 'string' &&
    typeof playlist.ownerUsername === 'string' &&
    user.username.toLowerCase() === playlist.ownerUsername.toLowerCase()

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
        <article className="group cursor-pointer">
          <div className="relative aspect-video overflow-hidden border border-play-border-subtle">
            <img
              src={playlist.thumbnail}
              alt=""
              className="h-full w-full object-cover transition group-hover:opacity-90"
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/85 via-black/45 to-transparent" />
            <div className="absolute bottom-4 left-5">
              <p className="text-md font-semibold text-play-foreground">Playlist</p>
              <p className="mt-1 text-md text-play-foreground">
                {playlist.views} • {playlist.uploadedAgo}
              </p>
            </div>
            <div className="absolute bottom-4 right-5 text-md font-semibold text-play-foreground">
              {playlist.videos}
            </div>
          </div>
          <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-play-foreground">
            {playlist.title}
          </h1>
          <button
            type="button"
            className="mt-1 inline-flex items-center gap-2 text-play-muted hover:text-play-foreground"
          >
            <IconChevronDown />
          </button>
        </article>

        <div className="mt-12 flex items-center gap-3 border-t border-play-border-subtle pt-4">
          <img src={profileAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
          <div>
            <p className="text-xl font-semibold text-play-foreground">{user.fullName || 'Lex Fridman'}</p>
            <p className="text-sm text-play-muted">705K Followers</p>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        {playlistDetailVideos.map((video) => (
          <article key={video.id} className="flex gap-2 border border-play-border-subtle p-1.5">
            <img src={video.thumbnail} alt="" className="h-20 w-40 shrink-0 object-cover" />
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-md font-semibold leading-tight text-play-foreground">
                {video.title}
              </h3>
              <p className="mt-1 text-sm text-play-muted">{video.channel}</p>
              <p className="text-sm text-play-muted">
                {video.views} • {video.uploadedAgo}
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

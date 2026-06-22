import { useState } from 'react'
import {
  IconBookmark,
  IconChevronDown,
  IconThumbsDown,
  IconThumbsUp,
} from '../icons/OutlineIcons.jsx'
import { VideoMoreMenu } from './VideoMoreMenu.jsx'
import { PlaylistModal } from '../modals/PlaylistModal.jsx'

export function VideoMetadataPanel({ video }) {
  const [descOpen, setDescOpen] = useState(false)
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false)

  return (
    <section className="rounded-2xl border border-play-border-subtle bg-play-canvas p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-play-foreground sm:text-2xl">
            {video.title}
          </h1>
          <p className="mt-2 text-sm text-play-muted">
            {video.views} Views • {video.uploadedAgo}
          </p>
        </div>

        <div className="relative z-30 flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
          <div className="flex items-center rounded-full border border-play-border-subtle bg-play-surface-elevated/80">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-l-full border-r border-play-border-subtle px-3 py-2 text-sm text-play-foreground hover:bg-white/5"
            >
              <IconThumbsUp className="h-4! w-4!" />
              <span>{video.likes}</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-r-full px-3 py-2 text-sm text-play-foreground hover:bg-white/5"
            >
              <IconThumbsDown className="h-4! w-4!" />
              <span>{video.dislikes}</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setPlaylistModalOpen(true)}
            className="flex items-center gap-2 rounded-full border border-play-border-subtle px-4 py-2 text-sm font-medium text-play-foreground hover:bg-play-surface-elevated"
          >
            <IconBookmark className="h-4! w-4!" />
            Save
          </button>
          <VideoMoreMenu />
        </div>
      </div>

      <div className="relative z-10 mt-6 flex flex-col gap-4 border-t border-play-border-subtle pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={video.channel.avatar}
            alt=""
            className="h-12 w-12 shrink-0 rounded-full border border-play-border-subtle object-cover"
          />
          <div className="min-w-0">
            <p className="font-semibold text-play-foreground">{video.channel.name}</p>
            <p className="text-sm text-play-muted">{video.channel.followers} Followers</p>
          </div>
        </div>
        <button
          type="button"
          className="w-full shrink-0 rounded-play-button bg-play-primary px-6 py-2.5 text-sm font-bold text-play-primary-foreground hover:bg-play-primary-hover sm:w-auto"
        >
          Follow
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-play-border-subtle bg-play-surface-elevated/40 p-4">
        <button
          type="button"
          onClick={() => setDescOpen((o) => !o)}
          className="flex w-full items-start justify-between gap-3 text-left"
        >
          <p
            className={`text-sm leading-relaxed text-play-muted ${descOpen ? '' : 'line-clamp-2'}`}
          >
            {video.description}
          </p>
          <IconChevronDown
            className={`h-5! w-5! shrink-0 text-play-muted transition ${descOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <PlaylistModal open={playlistModalOpen} onClose={() => setPlaylistModalOpen(false)} />
    </section>
  )
}

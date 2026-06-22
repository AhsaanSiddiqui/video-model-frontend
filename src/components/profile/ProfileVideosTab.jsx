import { IconPlayFill } from '../icons/OutlineIcons.jsx'

export function ProfileVideosTab({ videos, onCreateVideo, canCreate = false }) {
  if (!videos?.length) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-play-primary/60 bg-play-surface-elevated">
          <IconPlayFill className="text-play-primary" />
        </div>
        <h3 className="text-2xl font-semibold text-play-foreground">
          {canCreate ? 'No videos uploaded' : 'No videos found'}
        </h3>
        <p className="mt-2 max-w-md text-xl leading-relaxed text-play-muted">
          {canCreate
            ? 'Click to upload new video. You have yet to upload a video.'
            : 'No videos are available on this channel yet.'}
        </p>
        {canCreate ? (
          <button
            type="button"
            onClick={onCreateVideo}
            className="mt-5 rounded-play-button bg-play-primary px-6 py-3 text-lg font-semibold text-play-primary-foreground hover:bg-play-primary-hover"
          >
            + New video
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {videos.map((video) => (
        <article key={video.id} className="group cursor-pointer">
          <div className="aspect-video overflow-hidden border border-play-border-subtle">
            <img
              src={video.thumbnail}
              alt=""
              className="h-full w-full object-cover transition group-hover:opacity-90"
            />
          </div>
          <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug text-play-foreground">
            {video.title}
          </h3>
          <p className="mt-1 text-sm text-play-muted">
            {video.views} • {video.uploadedAgo}
          </p>
        </article>
      ))}
    </div>
  )
}

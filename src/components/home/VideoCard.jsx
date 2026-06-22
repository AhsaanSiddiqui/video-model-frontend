import { Link } from 'react-router-dom'

/**
 * Home grid card — 16:9 thumb, avatar, title (2 lines), views • time, channel.
 * Optional `id` wraps the card in a link to `/video/:id`.
 */
export default function VideoCard({
  id,
  title,
  channel,
  views,
  uploadedAgo,
  thumbnail,
  avatar,
}) {
  const body = (
    <>
      <div className="aspect-video w-full overflow-hidden bg-play-surface-elevated">
        <img
          src={thumbnail}
          alt=""
          className="h-full w-full object-cover transition duration-200 group-hover:opacity-90"
          loading="lazy"
        />
      </div>
      <div className="mt-3 flex gap-3">
        <img
          src={avatar}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-play-foreground">{title}</h3>
          <p className="mt-1 text-xs text-play-muted">
            {views} Views • {uploadedAgo}
          </p>
          <p className="mt-0.5 text-xs text-play-muted">{channel}</p>
        </div>
      </div>
    </>
  )

  if (id) {
    return (
      <Link
        to={`/video/${id}`}
        className="group block cursor-pointer no-underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-play-ring focus-visible:ring-offset-2 focus-visible:ring-offset-play-canvas"
      >
        {body}
      </Link>
    )
  }

  return <article className="group cursor-default">{body}</article>
}

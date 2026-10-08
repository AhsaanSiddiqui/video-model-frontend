import { Link, useNavigate } from 'react-router-dom'

/**
 * Home grid card — 16:9 thumb, avatar, title (2 lines), views • time, channel.
 * Optional `id` navigates to `/video/:id` on card click.
 */
export default function VideoCard({
  id,
  title,
  channel,
  ownerUsername,
  views,
  uploadedAgo,
  thumbnail,
  avatar,
}) {
  const navigate = useNavigate()

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
          <p className="mt-0.5 text-xs text-play-muted">
            {ownerUsername ? (
              <Link
                to={`/c/${ownerUsername}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:text-play-foreground hover:underline"
              >
                {channel}
              </Link>
            ) : (
              channel
            )}
          </p>
        </div>
      </div>
    </>
  )

  if (id) {
    return (
      <article
        role="link"
        tabIndex={0}
        onClick={() => navigate(`/video/${id}`)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            navigate(`/video/${id}`)
          }
        }}
        className="group block cursor-pointer no-underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-play-ring focus-visible:ring-offset-2 focus-visible:ring-offset-play-canvas"
      >
        {body}
      </article>
    )
  }

  return <article className="group cursor-default">{body}</article>
}

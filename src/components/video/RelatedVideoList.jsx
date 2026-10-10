import { Link } from 'react-router-dom'

export function RelatedVideoList({ videos }) {
  return (
    <aside className="min-h-0 overflow-visible">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-play-muted">
        Up next
      </h2>
      {!videos.length ? (
        <p className="border-t border-play-border-subtle pt-3 text-sm text-play-muted">
          No other videos yet.
        </p>
      ) : null}
      <ul className="divide-y divide-play-border-subtle border-t border-play-border-subtle">
        {videos.map((v) => (
          <li key={v.id} className="py-3 first:pt-3">
            <Link
              to={`/video/${v.id}`}
              className="group flex gap-3 no-underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-play-ring"
            >
              <div className="relative w-36 shrink-0 overflow-hidden rounded-lg border border-play-border-subtle aspect-video sm:w-40">
                <img
                  src={v.thumbnail}
                  alt=""
                  className="h-full w-full object-cover transition group-hover:opacity-90"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0 flex-1 py-0.5">
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-play-foreground group-hover:text-play-primary">
                  {v.title}
                </p>
                <p className="mt-1 text-xs text-play-muted">{v.channel}</p>
                <p className="mt-0.5 text-xs text-play-subtle">
                  {v.views} Views • {v.uploadedAgo}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

import { IconChevronLeft, IconChevronRight } from '../icons/OutlineIcons.jsx'

export function CommentsPanel({ comments }) {
  return (
    <section className="rounded-2xl border border-play-border-subtle bg-play-canvas p-4 sm:p-6">
      <h2 className="text-lg font-bold text-play-foreground">
        {comments.total.toLocaleString()} Comments
      </h2>

      <label className="mt-4 block">
        <span className="sr-only">Add a comment</span>
        <input
          type="text"
          placeholder="Add a Comment"
          className="w-full rounded-xl border border-play-border bg-transparent px-4 py-3 text-sm text-play-foreground placeholder:text-play-muted outline-none focus-visible:ring-1 focus-visible:ring-play-ring"
        />
      </label>

      <ul className="mt-6 space-y-6">
        {comments.items.map((c) => (
          <li key={c.id} className="flex gap-3">
            <img
              src={c.avatar}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full border border-play-border-subtle object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-play-foreground">
                <span className="font-semibold">{c.author}</span>{' '}
                <span className="text-play-muted">(@{c.handle})</span>{' '}
                <span className="text-play-subtle">{c.time}</span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-play-muted">{c.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-end gap-2 border-t border-play-border-subtle pt-4">
        <button
          type="button"
          className="rounded p-1.5 hover:bg-play-surface-elevated"
          aria-label="Previous page"
        >
          <IconChevronLeft />
        </button>
        <span className="min-w-[4.5rem] text-center text-sm tabular-nums text-play-muted">
          {comments.page} / {comments.totalPages}
        </span>
        <button
          type="button"
          className="rounded p-1.5 hover:bg-play-surface-elevated"
          aria-label="Next page"
        >
          <IconChevronRight />
        </button>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { IconChevronLeft, IconChevronRight } from '../icons/OutlineIcons.jsx'

export function CommentsPanel({ comments, loading = false, error = '', onAddComment, onPageChange }) {
  const [draft, setDraft] = useState('')
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState('')

  const canGoBack = comments.page > 1 && !loading
  const canGoForward = comments.page < comments.totalPages && !loading

  async function handleSubmit(event) {
    event.preventDefault()
    const content = draft.trim()
    if (!content || posting) return

    setPosting(true)
    setPostError('')
    const result = await onAddComment(content)
    if (result?.success) {
      setDraft('')
    } else {
      setPostError(result?.message || 'Failed to add comment')
    }
    setPosting(false)
  }

  return (
    <section className="rounded-2xl border border-play-border-subtle bg-play-canvas p-4 sm:p-6">
      <h2 className="text-lg font-bold text-play-foreground">
        {comments.total.toLocaleString()} Comments
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <label className="block flex-1">
          <span className="sr-only">Add a comment</span>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={posting}
            placeholder="Add a Comment"
            className="w-full rounded-xl border border-play-border bg-transparent px-4 py-3 text-sm text-play-foreground placeholder:text-play-muted outline-none focus-visible:ring-1 focus-visible:ring-play-ring disabled:opacity-60"
          />
        </label>
        <button
          type="submit"
          disabled={posting || !draft.trim()}
          className="shrink-0 rounded-play-button bg-play-primary px-5 text-sm font-bold text-play-primary-foreground hover:bg-play-primary-hover disabled:opacity-50"
        >
          {posting ? 'Posting…' : 'Comment'}
        </button>
      </form>
      {postError ? <p className="mt-2 text-sm text-red-400">{postError}</p> : null}

      {error ? (
        <p className="mt-6 text-sm text-red-400">{error}</p>
      ) : !comments.items.length && !loading ? (
        <p className="mt-6 text-sm text-play-muted">No comments yet. Be the first to comment.</p>
      ) : (
        <ul className={`mt-6 space-y-6 ${loading ? 'opacity-60' : ''}`}>
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
                  {c.handle ? <span className="text-play-muted">(@{c.handle})</span> : null}{' '}
                  <span className="text-play-subtle">{c.time}</span>
                </p>
                <p className="mt-1 whitespace-pre-line wrap-break-word text-sm leading-relaxed text-play-muted">
                  {c.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {comments.totalPages > 1 ? (
        <div className="mt-8 flex items-center justify-end gap-2 border-t border-play-border-subtle pt-4">
          <button
            type="button"
            onClick={() => onPageChange(comments.page - 1)}
            disabled={!canGoBack}
            className="rounded p-1.5 hover:bg-play-surface-elevated disabled:opacity-40"
            aria-label="Previous page"
          >
            <IconChevronLeft />
          </button>
          <span className="min-w-[4.5rem] text-center text-sm tabular-nums text-play-muted">
            {comments.page} / {comments.totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(comments.page + 1)}
            disabled={!canGoForward}
            className="rounded p-1.5 hover:bg-play-surface-elevated disabled:opacity-40"
            aria-label="Next page"
          >
            <IconChevronRight />
          </button>
        </div>
      ) : null}
    </section>
  )
}

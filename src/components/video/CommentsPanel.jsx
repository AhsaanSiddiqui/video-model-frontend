import { useState } from 'react'
import {
  IconChevronLeft,
  IconChevronRight,
  IconPencil,
  IconThumbsUp,
  IconTrash,
} from '../icons/OutlineIcons.jsx'
import { LoadingSpinner } from '../Loader.jsx'

export function CommentsPanel({
  comments,
  loading = false,
  error = '',
  currentUserId,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onToggleCommentLike,
  onPageChange,
}) {
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
      ) : loading ? (
        <LoadingSpinner layout="section" />
      ) : !comments.items.length ? (
        <p className="mt-6 text-sm text-play-muted">No comments yet. Be the first to comment.</p>
      ) : (
        <ul className="mt-6 space-y-6">
          {comments.items.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              isOwn={Boolean(currentUserId && c.ownerId === currentUserId)}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
              onToggleLike={onToggleCommentLike}
            />
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

function CommentItem({ comment: c, isOwn, onEdit, onDelete, onToggleLike }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(c.body)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [busy, setBusy] = useState(false)
  const [itemError, setItemError] = useState('')

  function startEditing() {
    setDraft(c.body)
    setItemError('')
    setConfirmingDelete(false)
    setEditing(true)
  }

  async function handleSave(event) {
    event.preventDefault()
    const content = draft.trim()
    if (!content || busy) return
    if (content === c.body) {
      setEditing(false)
      return
    }

    setBusy(true)
    setItemError('')
    const result = await onEdit(c.id, content)
    if (result?.success) {
      setEditing(false)
    } else {
      setItemError(result?.message || 'Failed to update comment')
    }
    setBusy(false)
  }

  async function handleDelete() {
    if (busy) return
    setBusy(true)
    setItemError('')
    const result = await onDelete(c.id)
    // on success the list reloads and this item unmounts
    if (!result?.success) {
      setItemError(result?.message || 'Failed to delete comment')
      setBusy(false)
      setConfirmingDelete(false)
    }
  }

  return (
    <li className="flex gap-3">
      <img
        src={c.avatar}
        alt=""
        className="h-10 w-10 shrink-0 rounded-full border border-play-border-subtle object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-play-foreground">
          <span className="font-semibold">{c.author}</span>{' '}
          {c.handle ? <span className="text-play-muted">(@{c.handle})</span> : null}{' '}
          <span className="text-play-subtle">
            {c.time}
            {c.edited ? ' (edited)' : ''}
          </span>
        </p>

        {editing ? (
          <form onSubmit={handleSave} className="mt-2 space-y-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={busy}
              rows={2}
              autoFocus
              aria-label="Edit comment"
              className="w-full resize-y rounded-xl border border-play-border bg-transparent px-3 py-2 text-sm text-play-foreground outline-none focus-visible:ring-1 focus-visible:ring-play-ring disabled:opacity-60"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={busy}
                className="rounded-play-button px-4 py-1.5 text-sm font-semibold text-play-muted hover:bg-play-surface-elevated"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                className="rounded-play-button bg-play-primary px-4 py-1.5 text-sm font-bold text-play-primary-foreground hover:bg-play-primary-hover disabled:opacity-50"
              >
                {busy ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        ) : (
          <p className="mt-1 whitespace-pre-line wrap-break-word text-sm leading-relaxed text-play-muted">
            {c.body}
          </p>
        )}

        {!editing ? (
          <div className="mt-2 flex flex-wrap items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => onToggleLike(c.id)}
              aria-pressed={c.isLiked}
              aria-label={c.isLiked ? 'Unlike comment' : 'Like comment'}
              className={`flex items-center gap-1 rounded-full px-2 py-1 hover:bg-play-surface-elevated ${
                c.isLiked ? 'text-play-primary' : 'text-play-muted'
              }`}
            >
              <IconThumbsUp className="h-3.5! w-3.5!" />
              {c.likes > 0 ? <span>{c.likes.toLocaleString()}</span> : null}
            </button>

            {isOwn && !confirmingDelete ? (
              <>
                <button
                  type="button"
                  onClick={startEditing}
                  className="flex items-center gap-1 rounded-full px-2 py-1 text-play-muted hover:bg-play-surface-elevated hover:text-play-foreground"
                >
                  <IconPencil className="h-3.5! w-3.5!" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="flex items-center gap-1 rounded-full px-2 py-1 text-play-muted hover:bg-play-surface-elevated hover:text-red-400"
                >
                  <IconTrash className="h-3.5! w-3.5!" />
                  Delete
                </button>
              </>
            ) : null}

            {isOwn && confirmingDelete ? (
              <span className="flex items-center gap-2 pl-2 text-play-muted">
                Delete this comment?
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={busy}
                  className="rounded-full px-2 py-1 font-semibold text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                >
                  {busy ? 'Deleting…' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  disabled={busy}
                  className="rounded-full px-2 py-1 hover:bg-play-surface-elevated"
                >
                  Cancel
                </button>
              </span>
            ) : null}
          </div>
        ) : null}

        {itemError ? <p className="mt-1 text-xs text-red-400">{itemError}</p> : null}
      </div>
    </li>
  )
}

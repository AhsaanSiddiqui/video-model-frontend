import { useState } from 'react'
import { IconBolt, IconThumbsUp, IconTrash, IconPencil } from '../icons/OutlineIcons.jsx'

const DEFAULT_AVATAR = 'https://i.pravatar.cc/80?u=play'

export function ProfileTweetsTab({
  tweets,
  canManage = false,
  onCreate,
  onUpdate,
  onDelete,
  onToggleLike,
}) {
  const [draft, setDraft] = useState('')
  const [posting, setPosting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState('')
  const [pendingId, setPendingId] = useState(null)
  const [error, setError] = useState('')

  async function handleCreate(event) {
    event.preventDefault()
    const content = draft.trim()
    if (!content || posting || !onCreate) return
    setPosting(true)
    setError('')
    const result = await onCreate(content)
    if (!result?.success) {
      setError(result?.message || 'Failed to post tweet')
    } else {
      setDraft('')
    }
    setPosting(false)
  }

  async function handleUpdate(tweetId) {
    const content = editDraft.trim()
    if (!content || pendingId || !onUpdate) return
    setPendingId(tweetId)
    setError('')
    const result = await onUpdate(tweetId, content)
    if (!result?.success) {
      setError(result?.message || 'Failed to update tweet')
    } else {
      setEditingId(null)
      setEditDraft('')
    }
    setPendingId(null)
  }

  async function handleDelete(tweetId) {
    if (pendingId || !onDelete) return
    setPendingId(tweetId)
    setError('')
    const result = await onDelete(tweetId)
    if (!result?.success) setError(result?.message || 'Failed to delete tweet')
    setPendingId(null)
  }

  async function handleLike(tweetId) {
    if (pendingId || !onToggleLike) return
    setPendingId(tweetId)
    setError('')
    const result = await onToggleLike(tweetId)
    if (!result?.success) setError(result?.message || 'Failed to update like')
    setPendingId(null)
  }

  return (
    <div>
      {canManage ? (
        <form onSubmit={handleCreate} className="border border-play-border-subtle p-3">
          <textarea
            rows={3}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write an announcement"
            className="w-full resize-none border-none bg-transparent text-lg text-play-foreground outline-none placeholder:text-play-muted"
          />
          <div className="mt-2 flex items-center justify-end gap-3">
            {error ? <p className="mr-auto text-sm text-red-400">{error}</p> : null}
            <button
              type="submit"
              disabled={posting || !draft.trim()}
              className="rounded-play-button bg-play-primary px-4 py-1.5 text-sm font-semibold text-play-primary-foreground disabled:opacity-50"
            >
              {posting ? 'Sending…' : 'Send'}
            </button>
          </div>
        </form>
      ) : error ? (
        <p className="mb-4 text-sm text-red-400">{error}</p>
      ) : null}

      {!tweets?.length ? (
        <div className="mt-10 flex min-h-48 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-play-primary/60 bg-play-surface-elevated">
            <IconBolt className="text-play-primary" />
          </div>
          <h3 className="text-3xl font-semibold text-play-foreground">No Announcements</h3>
          <p className="mt-2 max-w-md text-xl leading-relaxed text-play-muted">
            This page has yet to make an announcement.
          </p>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-play-border-subtle border-t border-play-border-subtle">
          {tweets.map((tweet) => {
            const avatar =
              typeof tweet.avatar === 'string' && tweet.avatar.trim()
                ? tweet.avatar.trim()
                : DEFAULT_AVATAR
            const isEditing = editingId === tweet.id
            return (
              <li key={tweet.id} className="py-4">
                <div className="flex gap-3">
                  <img src={avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-md text-play-foreground">
                      <span className="font-semibold">{tweet.author}</span>{' '}
                      <span className="text-play-subtle">{tweet.time}</span>
                    </p>
                    {isEditing ? (
                      <div className="mt-2">
                        <textarea
                          rows={3}
                          value={editDraft}
                          onChange={(event) => setEditDraft(event.target.value)}
                          className="w-full resize-none rounded border border-play-border-subtle bg-transparent p-2 text-md text-play-foreground outline-none"
                        />
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            disabled={pendingId === tweet.id || !editDraft.trim()}
                            onClick={() => handleUpdate(tweet.id)}
                            className="rounded-play-button bg-play-primary px-3 py-1.5 text-sm font-semibold text-play-primary-foreground disabled:opacity-50"
                          >
                            {pendingId === tweet.id ? 'Saving…' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-play-button border border-play-border-subtle px-3 py-1.5 text-sm text-play-foreground"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 text-md text-play-foreground">{tweet.body}</p>
                    )}
                    <div className="mt-2 flex items-center gap-4 text-sm text-play-muted">
                      <button
                        type="button"
                        onClick={() => handleLike(tweet.id)}
                        disabled={pendingId === tweet.id}
                        className={`inline-flex items-center gap-1 ${tweet.isLiked ? 'text-play-primary' : ''}`}
                      >
                        <IconThumbsUp className="h-4! w-4!" />
                        {tweet.likes}
                      </button>
                      {canManage && !isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(tweet.id)
                              setEditDraft(tweet.body)
                            }}
                            className="inline-flex items-center gap-1 hover:text-play-foreground"
                          >
                            <IconPencil className="h-4! w-4!" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(tweet.id)}
                            disabled={pendingId === tweet.id}
                            className="inline-flex items-center gap-1 hover:text-play-foreground"
                          >
                            <IconTrash className="h-4! w-4!" />
                            {pendingId === tweet.id ? 'Deleting…' : 'Delete'}
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

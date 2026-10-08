import { IconTrash } from '../icons/OutlineIcons.jsx'
import { useModalEscape } from './useModalEscape.js'

function CloseButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded p-1 text-2xl leading-none text-play-muted transition hover:bg-play-surface-elevated hover:text-play-foreground"
      aria-label="Close"
    >
      ×
    </button>
  )
}

export function DeleteVideoModal({ open, onClose, onConfirm, videoTitle }) {
  useModalEscape(open, onClose)

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Delete video"
    >
      <section className="w-full max-w-md rounded-lg border border-play-border-subtle bg-play-canvas p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-200/90">
              <IconTrash className="text-red-600" />
            </span>
            <h2 className="pt-1 text-lg font-semibold text-play-foreground">Delete Video</h2>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-play-foreground">
          Are you sure you want to delete
          {videoTitle ? (
            <>
              {' '}
              <span className="font-medium">&quot;{videoTitle}&quot;</span>
            </>
          ) : (
            ' this video'
          )}
          ? Once it&apos;s deleted, you will not be able to recover it.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-play-border px-4 py-2 text-sm font-semibold text-play-foreground transition hover:bg-play-surface-elevated"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm?.()
              onClose()
            }}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-red-400"
          >
            Delete
          </button>
        </div>
      </section>
    </div>
  )
}

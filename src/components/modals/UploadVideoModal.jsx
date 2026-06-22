import { useEffect } from 'react'

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-10 w-10 text-play-primary" aria-hidden>
      <path d="M12 16V5M12 5l-4 4M12 5l4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17.5V19a1 1 0 001 1h14a1 1 0 001-1v-1.5" strokeLinecap="round" />
    </svg>
  )
}

export function UploadVideoModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Upload videos"
    >
      <section className="w-full max-w-5xl border border-play-border-subtle bg-play-canvas">
        <div className="flex items-center justify-between border-b border-play-border-subtle px-4 py-3">
          <h2 className="text-xl font-semibold text-play-foreground">Upload Videos</h2>
          <button
            type="button"
            className="rounded-play-button bg-play-primary px-4 py-2 text-sm font-semibold text-play-primary-foreground hover:bg-play-primary-hover"
            onClick={onClose}
          >
            Save
          </button> 
        </div>

        <div className="space-y-5 p-6">
          <div className="flex min-h-72 flex-col items-center justify-center border border-dashed border-play-border-subtle text-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-play-surface-elevated">
              <UploadIcon />
            </div>
            <p className="text-xl font-semibold text-play-foreground">Drag and drop video files to upload</p>
            <p className="mt-1 text-lg text-play-muted">
              Your videos will be private until you publish them.
            </p>
            <button
              type="button"
              className="mt-4 rounded-play-button bg-play-primary px-6 py-2.5 text-base font-semibold text-play-primary-foreground hover:bg-play-primary-hover"
            >
              Select Files
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-play-foreground">Thumbnail*</label>
            <input
              type="file"
              className="w-full border border-play-border bg-transparent px-2 py-2 text-sm text-play-foreground file:mr-3 file:rounded-play-button file:border-0 file:bg-play-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-play-primary-foreground hover:file:bg-play-primary-hover"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-play-foreground">Title*</label>
            <input
              type="text"
              className="w-full border border-play-border bg-transparent px-3 py-2 text-sm text-play-foreground outline-none focus-visible:ring-1 focus-visible:ring-play-ring"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-play-foreground">Description*</label>
            <textarea
              rows={3}
              className="w-full border border-play-border bg-transparent px-3 py-2 text-sm text-play-foreground outline-none focus-visible:ring-1 focus-visible:ring-play-ring"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

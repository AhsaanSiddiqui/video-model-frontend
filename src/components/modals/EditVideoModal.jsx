import { useEffect, useRef, useState } from 'react'
import { useModalEscape } from './useModalEscape.js'

function IconFlag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-play-foreground" aria-hidden>
      <path d="M5 3v18M5 4h12l-2 3 2 3H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCloudUpload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-play-foreground" aria-hidden>
      <path
        d="M7 18a4 4 0 01-.88-7.903A5.5 5.5 0 0118.5 9.5a4.5 4.5 0 01.5 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 16V8M12 8l-3 3M12 8l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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

export function EditVideoModal({ open, onClose, video, onFinish }) {
  const thumbInputRef = useRef(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState('')

  useModalEscape(open, onClose)

  useEffect(() => {
    if (!open) return
    setTitle(video?.title ?? '')
    setDescription(video?.description ?? '')
    setThumbnail(video?.thumb ?? '')
  }, [open, video])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Edit video"
    >
      <section className="w-full max-w-xl rounded-lg border border-play-border-subtle bg-play-canvas p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-play-border-subtle">
              <IconFlag />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-play-foreground">Edit video</h2>
              <p className="mt-1 text-sm text-play-muted">Share where you&apos;ve worked on your profile.</p>
            </div>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative shrink-0 self-center sm:self-start">
            <img
              src={thumbnail || 'https://i.pravatar.cc/120?img=19'}
              alt=""
              className="size-20 rounded-full border-2 border-play-border object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-sky-500 text-[10px] text-white">
              ✓
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <input ref={thumbInputRef} type="file" accept="image/*" className="sr-only" />
            <button
              type="button"
              onClick={() => thumbInputRef.current?.click()}
              className="flex w-full flex-col items-center rounded-lg border border-play-border-subtle px-4 py-8 text-center transition hover:bg-play-surface-elevated/40"
            >
              <IconCloudUpload />
              <p className="mt-3 text-sm text-play-foreground">
                <span className="font-semibold text-emerald-400">Click to upload</span>
                <span className="text-play-muted"> or drag and drop</span>
              </p>
              <p className="mt-1 text-xs text-play-muted">SVG, PNG, JPG or GIF (max. 800×400px)</p>
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="edit-video-title" className="mb-1.5 block text-sm font-medium text-play-foreground">
              Title*
            </label>
            <input
              id="edit-video-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What is your title?"
              className="w-full rounded-md border border-play-border-subtle bg-transparent px-3 py-2.5 text-sm text-play-foreground placeholder:text-play-muted outline-none focus-visible:ring-2 focus-visible:ring-play-ring"
            />
          </div>

          <div>
            <label htmlFor="edit-video-description" className="mb-1.5 block text-sm font-medium text-play-foreground">
              Description*
            </label>
            <textarea
              id="edit-video-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. I joined Stripe's Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints."
              className="w-full resize-none rounded-md border border-play-border-subtle bg-transparent px-3 py-2.5 text-sm text-play-foreground placeholder:text-play-muted outline-none focus-visible:ring-2 focus-visible:ring-play-ring"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-play-border px-4 py-2.5 text-sm font-semibold text-play-foreground transition hover:bg-play-surface-elevated"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onFinish?.({ title, description, thumbnail })
              onClose()
            }}
            className="rounded-md bg-play-primary px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-play-primary-hover"
          >
            Finish
          </button>
        </div>
      </section>
    </div>
  )
}

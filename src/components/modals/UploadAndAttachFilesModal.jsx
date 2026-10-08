import { useRef, useState } from 'react'
import { IconTrash } from '../icons/OutlineIcons.jsx'
import { useModalEscape } from './useModalEscape.js'

function IconCloudUpload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-play-primary" aria-hidden>
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

function IconFilm() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 5v14M17 5v14M3 10h4M3 14h4M17 10h4M17 14h4" stroke="currentColor" strokeWidth="1.5" />
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

const MOCK_UPLOAD = {
  name: 'Dashboard prototype recording.mp4',
  size: '16 MB',
  progress: 40,
}

export function UploadAndAttachFilesModal({ open, onClose, onNext }) {
  const inputRef = useRef(null)
  const [upload, setUpload] = useState(MOCK_UPLOAD)

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
      aria-label="Upload and attach files"
    >
      <section className="w-full max-w-lg rounded-lg border border-play-border-subtle bg-play-canvas p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-play-foreground">Upload and attach files</h2>
            <p className="mt-1 text-sm text-play-muted">Upload and attach files to this project.</p>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        <input ref={inputRef} type="file" className="sr-only" accept="video/*,image/*" multiple />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-6 flex w-full flex-col items-center rounded-lg border border-play-border-subtle px-6 py-10 text-center transition hover:bg-play-surface-elevated/40"
        >
          <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-play-surface-elevated">
            <IconCloudUpload />
          </span>
          <p className="text-sm text-play-foreground">
            <span className="font-semibold text-play-primary">Click to upload</span>
            <span className="text-play-muted"> or drag and drop</span>
          </p>
          <p className="mt-1 text-xs text-play-muted">SVG, PNG, JPG or GIF (max. 800×400px)</p>
        </button>

        {upload ? (
          <div className="mt-4 rounded-lg border border-play-border-subtle p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-play-primary">
                <IconFilm />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-play-foreground">{upload.name}</p>
                    <p className="text-xs text-play-muted">{upload.size}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUpload(null)}
                    className="shrink-0 rounded p-1 text-play-foreground transition hover:bg-play-surface-elevated"
                    aria-label="Remove file"
                  >
                    <IconTrash />
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-play-surface-elevated">
                    <div
                      className="h-full rounded-full bg-play-primary transition-all"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-play-foreground">{upload.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

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
              onNext?.()
              onClose()
            }}
            className="rounded-md bg-play-primary px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-play-primary-hover"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  )
}

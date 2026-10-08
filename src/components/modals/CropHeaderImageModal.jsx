import { useRef, useState } from 'react'
import { useModalEscape } from './useModalEscape.js'

const PRESET_GRADIENTS = [
  'linear-gradient(135deg, #f472b6 0%, #fb923c 45%, #38bdf8 100%)',
  'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
  'linear-gradient(135deg, #34d399 0%, #22d3ee 100%)',
  'linear-gradient(135deg, #fbbf24 0%, #f87171 100%)',
]

function IconCrop() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-play-foreground" aria-hidden>
      <path d="M6 2v14a2 2 0 002 2h14M18 22V8a2 2 0 00-2-2H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

export function CropHeaderImageModal({ open, onClose, onSave }) {
  const fileInputRef = useRef(null)
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [gradient, setGradient] = useState(PRESET_GRADIENTS[0])

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
      aria-label="Crop header image"
    >
      <section className="w-full max-w-2xl rounded-lg border border-play-border-subtle bg-play-canvas p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-play-border-subtle bg-play-surface-elevated">
              <IconCrop />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-play-foreground">Crop header image</h2>
              <p className="mt-1 text-sm text-play-muted">Upload a 1600 × 480px image for best results.</p>
            </div>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        <div
          className="relative mt-6 aspect-[10/3] w-full overflow-hidden rounded-md"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #2a2a2a 25%, transparent 25%), linear-gradient(-45deg, #2a2a2a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2a2a2a 75%), linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
            backgroundColor: '#1a1a1a',
          }}
        >
          <div className="absolute inset-0" style={{ background: gradient }} />
          <div className="absolute inset-[12%] border-2 border-teal-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
            <span className="absolute -left-1 -top-1 size-2.5 border border-teal-400 bg-white" />
            <span className="absolute -right-1 -top-1 size-2.5 border border-teal-400 bg-white" />
            <span className="absolute -bottom-1 -left-1 size-2.5 border border-teal-400 bg-white" />
            <span className="absolute -bottom-1 -right-1 size-2.5 border border-teal-400 bg-white" />
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" />

        <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
          {PRESET_GRADIENTS.map((preset, index) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setSelectedPreset(index)
                setGradient(preset)
              }}
              className={[
                'size-12 shrink-0 rounded-full border-2 transition',
                selectedPreset === index ? 'border-teal-400 ring-2 ring-teal-400/40' : 'border-transparent',
              ].join(' ')}
              style={{ background: preset }}
              aria-label={`Preset ${index + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex size-12 shrink-0 items-center justify-center rounded-md border border-play-border bg-play-surface-elevated text-xl text-play-foreground transition hover:bg-play-canvas"
            aria-label="Upload new image"
          >
            +
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-play-border-subtle pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-play-border bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave?.({ gradient })
              onClose()
            }}
            className="rounded-md bg-play-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-play-primary-hover"
          >
            Save changes
          </button>
        </div>
      </section>
    </div>
  )
}

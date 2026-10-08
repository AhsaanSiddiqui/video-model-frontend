import { useEffect, useRef, useState } from 'react'
import { uploadVideo } from '../../api/video.api.js'
import { useModalEscape } from './useModalEscape.js'

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-10 w-10 text-play-primary" aria-hidden>
      <path d="M12 16V5M12 5l-4 4M12 5l4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17.5V19a1 1 0 001 1h14a1 1 0 001-1v-1.5" strokeLinecap="round" />
    </svg>
  )
}

export function UploadVideoModal({ open, onClose, onSuccess }) {
  const videoInputRef = useRef(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useModalEscape(open, onClose)

  useEffect(() => {
    if (!open) return
    setTitle('')
    setDescription('')
    setVideoFile(null)
    setThumbnail(null)
    setError('')
    setLoading(false)
  }, [open])

  async function handleSave() {
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.')
      return
    }
    if (!videoFile) {
      setError('Please select a video file.')
      return
    }
    if (!thumbnail) {
      setError('Please select a thumbnail image.')
      return
    }

    setLoading(true)
    setError('')

    const result = await uploadVideo({
      title: title.trim(),
      description: description.trim(),
      videoFile,
      thumbnail,
    })

    setLoading(false)

    if (!result.success) {
      setError(result.message || 'Upload failed. Please try again.')
      return
    }

    onSuccess?.(result.video)
    onClose()
  }

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
            disabled={loading}
            className="rounded-play-button bg-play-primary px-4 py-2 text-sm font-semibold text-play-primary-foreground hover:bg-play-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleSave}
          >
            {loading ? 'Uploading…' : 'Save'}
          </button>
        </div>

        <div className="space-y-5 p-6">
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
          />

          <div className="flex min-h-72 flex-col items-center justify-center border border-dashed border-play-border-subtle text-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-play-surface-elevated">
              <UploadIcon />
            </div>
            <p className="text-xl font-semibold text-play-foreground">Drag and drop video files to upload</p>
            <p className="mt-1 text-lg text-play-muted">Your video will be visible to everyone after upload.</p>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="mt-4 rounded-play-button bg-play-primary px-6 py-2.5 text-base font-semibold text-play-primary-foreground hover:bg-play-primary-hover"
            >
              {videoFile ? videoFile.name : 'Select Files'}
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-play-foreground">Thumbnail*</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              className="w-full border border-play-border bg-transparent px-2 py-2 text-sm text-play-foreground file:mr-3 file:rounded-play-button file:border-0 file:bg-play-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-play-primary-foreground hover:file:bg-play-primary-hover"
            />
          </div>

          <div>
            <label htmlFor="upload-video-title" className="mb-1 block text-sm font-semibold text-play-foreground">
              Title*
            </label>
            <input
              id="upload-video-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-play-border bg-transparent px-3 py-2 text-sm text-play-foreground outline-none focus-visible:ring-1 focus-visible:ring-play-ring"
            />
          </div>

          <div>
            <label htmlFor="upload-video-description" className="mb-1 block text-sm font-semibold text-play-foreground">
              Description*
            </label>
            <textarea
              id="upload-video-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-play-border bg-transparent px-3 py-2 text-sm text-play-foreground outline-none focus-visible:ring-1 focus-visible:ring-play-ring"
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </div>
      </section>
    </div>
  )
}

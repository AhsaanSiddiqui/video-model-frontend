import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { subscribeLoading } from '../api/loadingBar.js'

export function LoadingBar() {
  const [pending, setPending] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => subscribeLoading(setPending), [])

  useEffect(() => {
    if (pending > 0) {
      setVisible(true)
      return
    }

    const timer = setTimeout(() => setVisible(false), 200)
    return () => clearTimeout(timer)
  }, [pending])

  if (!visible) return null

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[80] flex justify-center" role="status" aria-label="Loading">
      <span className="flex size-9 items-center justify-center rounded-full bg-black/70 shadow-[0_0_16px_rgba(174,122,255,0.45)]">
        <svg viewBox="0 0 24 24" className="size-6 animate-spin text-play-primary" aria-hidden>
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </div>,
    document.body,
  )
}

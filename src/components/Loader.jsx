function SpinnerIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function LoadingSpinner({ layout = 'page', label = 'Loading' }) {
  if (layout === 'inline') {
    return (
      <span role="status" aria-label={label} className="inline-flex align-middle">
        <SpinnerIcon className="size-4 animate-spin" />
      </span>
    )
  }

  const frame =
    layout === 'section'
      ? 'flex min-h-36 w-full items-center justify-center py-6'
      : 'flex min-h-[calc(100dvh-var(--play-header-height)-4rem)] w-full items-center justify-center'

  return (
    <div role="status" aria-label={label} className={frame}>
      <SpinnerIcon className="size-11 animate-spin text-play-primary" />
    </div>
  )
}

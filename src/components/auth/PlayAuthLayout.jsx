/**
 * Centered auth shell: black canvas, PLAY wordmark, constrained form width.
 */
export function PlayAuthLayout({ children }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center overflow-y-auto bg-play-canvas px-5 py-12">
      <h1 className="mb-10 text-center text-2xl font-bold tracking-[0.2em] text-play-foreground">
        PLAY
      </h1>
      <div className="w-full max-w-[360px] space-y-5">{children}</div>
    </div>
  )
}

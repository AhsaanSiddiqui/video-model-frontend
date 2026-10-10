export function WatchVideoPlayer({ partLabel, videoSrc, posterSrc }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-play-border-subtle bg-black">
      <div className="relative aspect-video w-full">
        <video
          className="h-full w-full object-contain"
          controls
          preload="metadata"
          poster={posterSrc}
          src={videoSrc}
        >
          Your browser does not support the video tag.
        </video>

        {partLabel ? (
          <div className="pointer-events-none absolute left-4 top-4 rounded-md bg-black/55 px-2 py-1 text-xs font-medium tracking-wide text-white sm:left-5 sm:top-5">
            {partLabel}
          </div>
        ) : null}
      </div>
    </div>
  )
}

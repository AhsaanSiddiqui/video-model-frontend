import { IconChevronLeft, IconChevronRight, IconPlayFill } from '../icons/OutlineIcons.jsx'

export function NoVideosFound({
  title = 'No videos available',
  description = 'There are no videos here available. Please try to search something else.',
  pageLabel = '8 / 60',
}) {
  return (
    <section className="relative mx-auto flex min-h-[calc(100dvh-var(--play-header-height)-6.5rem)] w-full max-w-[1920px] items-center justify-center">
      <div className="flex max-w-xl flex-col items-center text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-play-primary/70 bg-play-surface-elevated">
          <IconPlayFill className="h-6! w-6! translate-x-px text-play-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-play-foreground">{title}</h1>
        <p className="mt-3 text-xl leading-relaxed text-play-muted">{description}</p>
      </div>
    </section>
  )
}

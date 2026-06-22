import { Link } from 'react-router-dom'
import { WatchVideoPlayer } from '../components/video/WatchVideoPlayer.jsx'
import { VideoMetadataPanel } from '../components/video/VideoMetadataPanel.jsx'
import { CommentsPanel } from '../components/video/CommentsPanel.jsx'
import { RelatedVideoList } from '../components/video/RelatedVideoList.jsx'
import {
  commentsMock,
  relatedVideosMock,
  watchVideoMock,
} from '../data/videoWatchMock.js'

export default function VideoDetails() {
  return (
    <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-8 text-play-foreground lg:flex-row lg:items-start lg:gap-8">
      <div className="min-w-0 flex-1 space-y-6">
        <Link
          to="/"
          className="inline-block text-sm font-medium text-play-muted hover:text-play-primary"
        >
          ← Back to home
        </Link>

        <WatchVideoPlayer
          partLabel={watchVideoMock.partLabel}
          videoSrc={watchVideoMock.videoSrc}
          posterSrc={watchVideoMock.posterSrc}
        />

        <VideoMetadataPanel video={watchVideoMock} />

        <CommentsPanel comments={commentsMock} />
      </div>

      <div className="w-full shrink-0 lg:w-[min(100%,420px)] xl:w-[440px]">
        <RelatedVideoList videos={relatedVideosMock} />
      </div>
    </div>
  )
}

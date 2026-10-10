import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { WatchVideoPlayer } from '../components/video/WatchVideoPlayer.jsx'
import { VideoMetadataPanel } from '../components/video/VideoMetadataPanel.jsx'
import { CommentsPanel } from '../components/video/CommentsPanel.jsx'
import { RelatedVideoList } from '../components/video/RelatedVideoList.jsx'
import { NoVideosFound } from '../components/empty/NoVideosFound.jsx'
import { fetchVideoById, fetchVideos } from '../api/video.api.js'
import { addComment, fetchVideoComments } from '../api/comment.api.js'
import { toggleVideoLike } from '../api/like.api.js'
import { toggleSubscription } from '../api/subscription.api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { formatTimeAgo, formatViews, mapVideoToCard } from '../utils/videoFormat.js'

const DEFAULT_AVATAR = 'https://i.pravatar.cc/96?u=play'
const COMMENTS_PER_PAGE = 10
const RELATED_LIMIT = 10

function mapVideoToWatch(video) {
  const owner = video?.owner ?? {}

  return {
    id: video?._id,
    title: video?.title ?? 'Untitled',
    description: video?.description ?? '',
    views: formatViews(video?.views),
    uploadedAgo: formatTimeAgo(video?.createdAt),
    videoSrc: video?.videoFile,
    posterSrc: video?.thumbnail,
    likes: video?.likesCount ?? 0,
    isLiked: Boolean(video?.isLiked),
    isSubscribed: Boolean(video?.isSubscribed),
    subscribersCount: video?.subscribersCount ?? 0,
    channel: {
      id: owner._id,
      name: owner.fullName || owner.username || 'Unknown channel',
      handle: owner.username,
      avatar:
        typeof owner.avatar === 'string' && owner.avatar.trim()
          ? owner.avatar.trim()
          : DEFAULT_AVATAR,
    },
  }
}

function mapComment(comment) {
  const owner = comment?.owner ?? {}

  return {
    id: comment?._id,
    author: owner.fullName || owner.username || 'Unknown user',
    handle: owner.username,
    avatar:
      typeof owner.avatar === 'string' && owner.avatar.trim()
        ? owner.avatar.trim()
        : DEFAULT_AVATAR,
    time: formatTimeAgo(comment?.createdAt),
    body: comment?.content ?? '',
  }
}

export default function VideoDetails() {
  const { videoId } = useParams()
  const { user, isAuthenticated } = useAuth()

  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [comments, setComments] = useState({ items: [], total: 0, page: 1, totalPages: 1 })
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsError, setCommentsError] = useState('')

  const [related, setRelated] = useState([])
  const [likePending, setLikePending] = useState(false)
  const [subscribePending, setSubscribePending] = useState(false)
  const [actionError, setActionError] = useState('')

  const loadVideo = useCallback(async () => {
    setLoading(true)
    setError('')
    setActionError('')

    const result = await fetchVideoById(videoId)

    if (!result.success || !result.video) {
      setError(result.message || 'Could not load video')
      setVideo(null)
    } else {
      setVideo(mapVideoToWatch(result.video))
    }

    setLoading(false)
  }, [videoId])

  const loadComments = useCallback(
    async (page = 1) => {
      setCommentsLoading(true)
      setCommentsError('')

      const result = await fetchVideoComments(videoId, { page, limit: COMMENTS_PER_PAGE })

      if (!result.success) {
        setCommentsError(result.message)
      } else {
        setComments({
          items: result.comments.map(mapComment),
          total: result.totalComments,
          page: result.currentPage,
          totalPages: result.totalPages,
        })
      }

      setCommentsLoading(false)
    },
    [videoId],
  )

  const loadRelated = useCallback(async () => {
    const result = await fetchVideos({ page: 1, limit: RELATED_LIMIT + 1 })
    if (!result.success) {
      setRelated([])
      return
    }
    setRelated(
      result.videos
        .filter((v) => v._id !== videoId)
        .slice(0, RELATED_LIMIT)
        .map(mapVideoToCard),
    )
  }, [videoId])

  useEffect(() => {
    if (!isAuthenticated) return
    window.scrollTo({ top: 0 })
    loadVideo()
    loadComments(1)
    loadRelated()
  }, [isAuthenticated, loadVideo, loadComments, loadRelated])

  async function handleToggleLike() {
    if (!video || likePending) return
    setLikePending(true)
    setActionError('')

    // optimistic update, rolled back if the request fails
    const previous = video
    setVideo((v) => ({
      ...v,
      isLiked: !v.isLiked,
      likes: v.likes + (v.isLiked ? -1 : 1),
    }))

    const result = await toggleVideoLike(video.id)
    if (!result.success) {
      setVideo(previous)
      setActionError(result.message)
    }
    setLikePending(false)
  }

  async function handleToggleSubscribe() {
    if (!video?.channel.id || subscribePending) return
    setSubscribePending(true)
    setActionError('')

    const previous = video
    setVideo((v) => ({
      ...v,
      isSubscribed: !v.isSubscribed,
      subscribersCount: v.subscribersCount + (v.isSubscribed ? -1 : 1),
    }))

    const result = await toggleSubscription(video.channel.id)
    if (!result.success) {
      setVideo(previous)
      setActionError(result.message)
    }
    setSubscribePending(false)
  }

  async function handleAddComment(content) {
    const result = await addComment(videoId, content)
    if (!result.success) return result

    // newest comments come first, so jump back to page 1 to show it
    await loadComments(1)
    return result
  }

  if (!isAuthenticated) {
    return (
      <NoVideosFound
        title="Sign in to watch videos"
        description="Log in to watch this video, leave comments and follow the channel."
      />
    )
  }

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-[1920px] animate-pulse flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          <div className="aspect-video w-full rounded-2xl bg-play-surface-elevated" />
          <div className="h-40 rounded-2xl bg-play-surface-elevated" />
        </div>
        <div className="h-96 w-full shrink-0 rounded-2xl bg-play-surface-elevated lg:w-[min(100%,420px)] xl:w-[440px]" />
      </div>
    )
  }

  if (error || !video) {
    return (
      <section className="mx-auto flex min-h-64 max-w-xl flex-col items-center justify-center text-center">
        <p className="text-lg text-play-muted">{error || 'Video not found'}</p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={loadVideo}
            className="rounded-play-button bg-play-primary px-5 py-2 text-sm font-semibold text-play-primary-foreground hover:bg-play-primary-hover"
          >
            Try again
          </button>
          <Link
            to="/"
            className="rounded-play-button border border-play-border-subtle px-5 py-2 text-sm font-semibold text-play-foreground hover:bg-play-surface-elevated"
          >
            Back to home
          </Link>
        </div>
      </section>
    )
  }

  const isOwner = Boolean(user?._id && video.channel.id && user._id === video.channel.id)

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
          key={video.id}
          videoSrc={video.videoSrc}
          posterSrc={video.posterSrc}
        />

        {actionError ? (
          <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {actionError}
          </p>
        ) : null}

        <VideoMetadataPanel
          video={video}
          isOwner={isOwner}
          likePending={likePending}
          subscribePending={subscribePending}
          onToggleLike={handleToggleLike}
          onToggleSubscribe={handleToggleSubscribe}
        />

        <CommentsPanel
          comments={comments}
          loading={commentsLoading}
          error={commentsError}
          onAddComment={handleAddComment}
          onPageChange={loadComments}
        />
      </div>

      <div className="w-full shrink-0 lg:w-[min(100%,420px)] xl:w-[440px]">
        <RelatedVideoList videos={related} />
      </div>
    </div>
  )
}

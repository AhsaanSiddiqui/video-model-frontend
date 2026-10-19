import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { WatchVideoPlayer } from '../components/video/WatchVideoPlayer.jsx'
import { VideoMetadataPanel } from '../components/video/VideoMetadataPanel.jsx'
import { CommentsPanel } from '../components/video/CommentsPanel.jsx'
import { RelatedVideoList } from '../components/video/RelatedVideoList.jsx'
import { NoVideosFound } from '../components/empty/NoVideosFound.jsx'
import { fetchVideoById, fetchVideos } from '../api/video.api.js'
import {
  addComment,
  deleteComment,
  fetchVideoComments,
  updateComment,
} from '../api/comment.api.js'
import { toggleCommentLike, toggleVideoDislike, toggleVideoLike } from '../api/like.api.js'
import { toggleSubscription } from '../api/subscription.api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { formatTimeAgo, formatViews, mapVideoToCard } from '../utils/videoFormat.js'
import { LoadingSpinner } from '../components/Loader.jsx'

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
    dislikes: video?.dislikesCount ?? 0,
    isLiked: Boolean(video?.isLiked),
    isDisliked: Boolean(video?.isDisliked),
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
    ownerId: owner._id,
    likes: comment?.likesCount ?? 0,
    isLiked: Boolean(comment?.isLiked),
    edited: Boolean(
      comment?.updatedAt && comment?.createdAt && comment.updatedAt !== comment.createdAt,
    ),
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

  // type: 'like' | 'dislike'. Same reaction again removes it; the other one switches.
  async function handleReaction(type) {
    if (!video || likePending) return
    setLikePending(true)
    setActionError('')

    // optimistic update, then replaced with the server's counts
    const previous = video
    setVideo((v) => {
      const current = v.isLiked ? 'like' : v.isDisliked ? 'dislike' : null
      const next = current === type ? null : type
      return {
        ...v,
        isLiked: next === 'like',
        isDisliked: next === 'dislike',
        likes: v.likes + (next === 'like' ? 1 : 0) - (current === 'like' ? 1 : 0),
        dislikes: v.dislikes + (next === 'dislike' ? 1 : 0) - (current === 'dislike' ? 1 : 0),
      }
    })

    const toggle = type === 'like' ? toggleVideoLike : toggleVideoDislike
    const result = await toggle(video.id)
    if (!result.success) {
      setVideo(previous)
      setActionError(result.message)
    } else if (typeof result.likesCount === 'number') {
      setVideo((v) => ({
        ...v,
        isLiked: result.reaction === 'like',
        isDisliked: result.reaction === 'dislike',
        likes: result.likesCount,
        dislikes: result.dislikesCount ?? v.dislikes,
      }))
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

  function patchComment(commentId, changes) {
    setComments((prev) => ({
      ...prev,
      items: prev.items.map((c) => (c.id === commentId ? { ...c, ...changes } : c)),
    }))
  }

  async function handleEditComment(commentId, content) {
    const result = await updateComment(commentId, content)
    if (result.success) {
      patchComment(commentId, { body: result.comment?.content ?? content, edited: true })
    }
    return result
  }

  async function handleDeleteComment(commentId) {
    const result = await deleteComment(commentId)
    if (!result.success) return result

    // stay on the same page unless it was the last comment on it
    const page =
      comments.items.length === 1 && comments.page > 1 ? comments.page - 1 : comments.page
    await loadComments(page)
    return result
  }

  async function handleToggleCommentLike(commentId) {
    const comment = comments.items.find((c) => c.id === commentId)
    if (!comment) return

    patchComment(commentId, {
      isLiked: !comment.isLiked,
      likes: comment.likes + (comment.isLiked ? -1 : 1),
    })
    const result = await toggleCommentLike(commentId)
    if (!result.success) {
      patchComment(commentId, { isLiked: comment.isLiked, likes: comment.likes })
      setActionError(result.message)
    }
  }

  if (!isAuthenticated) {
    return (
      <NoVideosFound
        title="Sign in to watch videos"
        description="Log in to watch this video, leave comments and follow the channel."
      />
    )
  }

  if (loading) return <LoadingSpinner />

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
          onToggleLike={() => handleReaction('like')}
          onToggleDislike={() => handleReaction('dislike')}
          onToggleSubscribe={handleToggleSubscribe}
        />

        <CommentsPanel
          comments={comments}
          loading={commentsLoading}
          error={commentsError}
          currentUserId={user?._id}
          onAddComment={handleAddComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          onToggleCommentLike={handleToggleCommentLike}
          onPageChange={loadComments}
        />
      </div>

      <div className="w-full shrink-0 lg:w-[min(100%,420px)] xl:w-[440px]">
        <RelatedVideoList videos={related} />
      </div>
    </div>
  )
}

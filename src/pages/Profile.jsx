import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchVideos } from '../api/video.api.js'
import { fetchChannelProfile } from '../api/user.api.js'
import { fetchSubscribedChannels, toggleSubscription } from '../api/subscription.api.js'
import { fetchUserPlaylists, fetchPlaylistById } from '../api/playlist.api.js'
import { createTweet, deleteTweet, fetchUserTweets, updateTweet } from '../api/tweet.api.js'
import { toggleTweetLike } from '../api/like.api.js'
import { formatTimeAgo, mapPlaylistCard, mapVideoToCard } from '../utils/videoFormat.js'
import { ProfileHeader } from '../components/profile/ProfileHeader.jsx'
import { ProfileTabs } from '../components/profile/ProfileTabs.jsx'
import { ProfileVideosTab } from '../components/profile/ProfileVideosTab.jsx'
import { ProfilePlaylistsTab } from '../components/profile/ProfilePlaylistsTab.jsx'
import { ProfileTweetsTab } from '../components/profile/ProfileTweetsTab.jsx'
import { ProfileFollowingTab } from '../components/profile/ProfileFollowingTab.jsx'
import { UploadVideoModal } from '../components/modals/UploadVideoModal.jsx'
import { PROFILE_TABS } from '../data/profileMock.js'
import { LoadingSpinner } from '../components/Loader.jsx'

function mapTweet(tweet) {
  const owner = tweet?.owner && typeof tweet.owner === 'object' ? tweet.owner : {}
  return {
    id: tweet?._id ?? tweet?.id,
    author: owner.fullName || owner.username || 'Channel',
    avatar: owner.avatar,
    time: formatTimeAgo(tweet?.createdAt),
    body: tweet?.content || '',
    likes: tweet?.likes ?? 0,
    isLiked: Boolean(tweet?.isLiked),
  }
}

export default function Profile() {
  const { isAuthenticated, user } = useAuth()
  const [activeTab, setActiveTab] = useState('Videos')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [channelVideos, setChannelVideos] = useState([])
  const [videosLoading, setVideosLoading] = useState(true)
  const [playlists, setPlaylists] = useState([])
  const [playlistsLoading, setPlaylistsLoading] = useState(false)
  const [playlistsError, setPlaylistsError] = useState('')
  const [tweets, setTweets] = useState([])
  const [tweetsLoading, setTweetsLoading] = useState(false)
  const [tweetsError, setTweetsError] = useState('')
  const [counts, setCounts] = useState({ subscribers: 0, subscribed: 0 })
  const [coverImage, setCoverImage] = useState('')
  const [following, setFollowing] = useState([])
  const [followingLoading, setFollowingLoading] = useState(false)
  const [followingError, setFollowingError] = useState('')
  const [pendingFollowId, setPendingFollowId] = useState(null)

  const profile = useMemo(
    () => ({
      fullName: user?.fullName || 'Yash Mittal',
      username: user?.username || 'YashMittal',
      avatar:
        typeof user?.avatar === 'string' && /^https?:\/\//i.test(user.avatar.trim())
          ? user.avatar.trim()
          : 'https://i.pravatar.cc/200?img=19',
      subscribers: counts.subscribers,
      subscribed: counts.subscribed,
      coverImage,
    }),
    [user, counts, coverImage],
  )

  const isOwner =
    typeof user?.username === 'string' &&
    typeof profile.username === 'string' &&
    user.username.toLowerCase() === profile.username.toLowerCase()

  const loadChannelVideos = useCallback(async () => {
    if (!user?._id) {
      setChannelVideos([])
      setVideosLoading(false)
      return
    }

    setVideosLoading(true)
    const result = await fetchVideos({ userId: user._id, limit: 50 })
    setChannelVideos(result.success ? result.videos.map(mapVideoToCard) : [])
    setVideosLoading(false)
  }, [user?._id])

  const loadPlaylists = useCallback(async () => {
    if (!user?._id) {
      setPlaylists([])
      setPlaylistsLoading(false)
      return
    }

    setPlaylistsLoading(true)
    setPlaylistsError('')
    const result = await fetchUserPlaylists(user._id)
    if (!result.success) {
      setPlaylists([])
      setPlaylistsError(result.message)
    } else {
      const detailed = await Promise.all(
        result.playlists.map(async (playlist) => {
          const videos = playlist.videos ?? []
          const needsCover = videos.some((video) => !video?.thumbnail)
          if (!needsCover) return playlist
          const full = await fetchPlaylistById(playlist._id)
          return full.success && full.playlist ? full.playlist : playlist
        }),
      )
      setPlaylists(detailed.map(mapPlaylistCard))
    }
    setPlaylistsLoading(false)
  }, [user?._id])

  const loadTweets = useCallback(async () => {
    if (!user?._id) {
      setTweets([])
      setTweetsLoading(false)
      return
    }

    setTweetsLoading(true)
    setTweetsError('')
    const result = await fetchUserTweets(user._id)
    if (!result.success) {
      setTweets([])
      setTweetsError(result.message)
    } else {
      setTweets(result.tweets.map(mapTweet))
    }
    setTweetsLoading(false)
  }, [user?._id])

  async function handleCreateTweet(content) {
    const result = await createTweet(content)
    if (result.success && result.tweet) {
      setTweets((prev) => [mapTweet({ ...result.tweet, likes: 0, isLiked: false }), ...prev])
    }
    return result
  }

  async function handleUpdateTweet(tweetId, content) {
    const result = await updateTweet(tweetId, content)
    if (result.success) {
      setTweets((prev) => prev.map((tweet) => (tweet.id === tweetId ? { ...tweet, body: content } : tweet)))
    }
    return result
  }

  async function handleDeleteTweet(tweetId) {
    const result = await deleteTweet(tweetId)
    if (result.success) {
      setTweets((prev) => prev.filter((tweet) => tweet.id !== tweetId))
    }
    return result
  }

  async function handleToggleTweetLike(tweetId) {
    const result = await toggleTweetLike(tweetId)
    if (result.success) {
      setTweets((prev) =>
        prev.map((tweet) => {
          if (tweet.id !== tweetId) return tweet
          const isLiked = typeof result.isLiked === 'boolean' ? result.isLiked : !tweet.isLiked
          const likes = typeof result.likes === 'number' ? result.likes : tweet.likes + (isLiked ? 1 : -1)
          return { ...tweet, isLiked, likes: Math.max(0, likes) }
        }),
      )
    }
    return result
  }

  const loadFollowing = useCallback(async () => {
    if (!user?._id) {
      setFollowing([])
      setFollowingLoading(false)
      return
    }

    setFollowingLoading(true)
    setFollowingError('')
    const result = await fetchSubscribedChannels(user._id)
    if (!result.success) {
      setFollowing([])
      setFollowingError(result.message)
    } else {
      setFollowing(result.channels)
      setCounts((prev) => ({ ...prev, subscribed: result.channels.length }))
    }
    setFollowingLoading(false)
  }, [user?._id])

  async function handleUnfollow(channelId) {
    if (pendingFollowId) return
    setPendingFollowId(channelId)
    setFollowingError('')
    const result = await toggleSubscription(channelId)
    if (!result.success) {
      setFollowingError(result.message)
    } else {
      setFollowing((prev) => prev.filter((channel) => channel._id !== channelId))
      setCounts((prev) => ({ ...prev, subscribed: Math.max(0, prev.subscribed - 1) }))
    }
    setPendingFollowId(null)
  }

  useEffect(() => {
    if (!user?.username) return
    let cancelled = false

    async function loadCounts() {
      const result = await fetchChannelProfile(user.username)
      if (cancelled || !result.success || !result.channel) return
      setCounts({
        subscribers: result.channel.subscriberCount ?? 0,
        subscribed: result.channel.channelsSubscribedToCount ?? 0,
      })
      setCoverImage(result.channel.coverImage || '')
    }

    loadCounts()
    return () => {
      cancelled = true
    }
  }, [user?.username])

  useEffect(() => {
    if (!isAuthenticated || !user) return
    if (activeTab === 'Videos') {
      loadChannelVideos()
    }
    if (activeTab === 'Playlist') {
      loadPlaylists()
    }
    if (activeTab === 'Tweets') {
      loadTweets()
    }
    if (activeTab === 'Following') {
      loadFollowing()
    }
  }, [activeTab, isAuthenticated, user, loadChannelVideos, loadPlaylists, loadTweets, loadFollowing])

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="mx-auto max-w-[1920px]">
      <ProfileHeader profile={profile} isOwner={isOwner} />
      <div className="border-b border-play-border-subtle px-3 pb-1 sm:px-4">
        <ProfileTabs tabs={PROFILE_TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <section className="px-3 py-4 sm:px-4">
        {activeTab === 'Videos' ? (
          videosLoading ? (
            <LoadingSpinner layout="section" />
          ) : (
            <ProfileVideosTab
              videos={channelVideos}
              canCreate={isOwner}
              onCreateVideo={() => setUploadModalOpen(true)}
            />
          )
        ) : null}
        {activeTab === 'Playlist' ? (
          playlistsLoading ? (
            <LoadingSpinner layout="section" />
          ) : playlistsError ? (
            <p className="py-10 text-center text-play-muted">{playlistsError}</p>
          ) : (
            <ProfilePlaylistsTab playlists={playlists} />
          )
        ) : null}
        {activeTab === 'Tweets' ? (
          tweetsLoading ? (
            <LoadingSpinner layout="section" />
          ) : tweetsError ? (
            <p className="py-10 text-center text-play-muted">{tweetsError}</p>
          ) : (
            <ProfileTweetsTab
              tweets={tweets}
              canManage={isOwner}
              onCreate={handleCreateTweet}
              onUpdate={handleUpdateTweet}
              onDelete={handleDeleteTweet}
              onToggleLike={handleToggleTweetLike}
            />
          )
        ) : null}
        {activeTab === 'Following' ? (
          <ProfileFollowingTab
            channels={following}
            loading={followingLoading}
            error={followingError}
            pendingId={pendingFollowId}
            onToggle={handleUnfollow}
          />
        ) : null}
      </section>

      <UploadVideoModal
        open={uploadModalOpen && isOwner}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={() => loadChannelVideos()}
      />
    </div>
  )
}

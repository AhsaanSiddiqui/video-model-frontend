import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchVideos } from '../api/video.api.js'
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
import { PROFILE_TABS, profileFollowing } from '../data/profileMock.js'
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

  const profile = useMemo(
    () => ({
      fullName: user?.fullName || 'Yash Mittal',
      username: user?.username || 'YashMittal',
      avatar:
        typeof user?.avatar === 'string' && /^https?:\/\//i.test(user.avatar.trim())
          ? user.avatar.trim()
          : 'https://i.pravatar.cc/200?img=19',
      subscribers: '600K Subscribers',
      subscribed: '220 Subscribed',
    }),
    [user],
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
  }, [activeTab, isAuthenticated, user, loadChannelVideos, loadPlaylists, loadTweets])

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
        {activeTab === 'Following' ? <ProfileFollowingTab following={profileFollowing} /> : null}
      </section>

      <UploadVideoModal
        open={uploadModalOpen && isOwner}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={() => loadChannelVideos()}
      />
    </div>
  )
}

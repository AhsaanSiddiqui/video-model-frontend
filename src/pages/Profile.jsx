import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchVideos } from '../api/video.api.js'
import { mapVideoToCard } from '../utils/videoFormat.js'
import { ProfileHeader } from '../components/profile/ProfileHeader.jsx'
import { ProfileTabs } from '../components/profile/ProfileTabs.jsx'
import { ProfileVideosTab } from '../components/profile/ProfileVideosTab.jsx'
import { ProfilePlaylistsTab } from '../components/profile/ProfilePlaylistsTab.jsx'
import { ProfileTweetsTab } from '../components/profile/ProfileTweetsTab.jsx'
import { ProfileFollowingTab } from '../components/profile/ProfileFollowingTab.jsx'
import { UploadVideoModal } from '../components/modals/UploadVideoModal.jsx'
import {
  PROFILE_TABS,
  profileFollowing,
  profilePlaylists,
  profileTweets,
} from '../data/profileMock.js'

export default function Profile() {
  const { isAuthenticated, user } = useAuth()
  const [activeTab, setActiveTab] = useState('Videos')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [channelVideos, setChannelVideos] = useState([])
  const [videosLoading, setVideosLoading] = useState(true)

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

  useEffect(() => {
    if (!isAuthenticated || !user) return
    if (activeTab === 'Videos') {
      loadChannelVideos()
    }
  }, [activeTab, isAuthenticated, user, loadChannelVideos])

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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-video bg-play-surface-elevated" />
                  <div className="mt-2 h-4 rounded bg-play-surface-elevated" />
                </div>
              ))}
            </div>
          ) : (
            <ProfileVideosTab
              videos={channelVideos}
              canCreate={isOwner}
              onCreateVideo={() => setUploadModalOpen(true)}
            />
          )
        ) : null}
        {activeTab === 'Playlist' ? <ProfilePlaylistsTab playlists={profilePlaylists} /> : null}
        {activeTab === 'Tweets' ? <ProfileTweetsTab tweets={profileTweets} /> : null}
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

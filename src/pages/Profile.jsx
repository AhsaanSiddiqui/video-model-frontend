import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
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
  profileVideos,
} from '../data/profileMock.js'

export default function Profile() {
  const { isAuthenticated, user } = useAuth()
  const [activeTab, setActiveTab] = useState('Videos')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const profile = useMemo(
    () => ({
      fullName: user.fullName || 'Yash Mittal',
      username: user.username || 'YashMittal',
      avatar:
        typeof user.avatar === 'string' && /^https?:\/\//i.test(user.avatar.trim())
          ? user.avatar.trim()
          : 'https://i.pravatar.cc/200?img=19',
      subscribers: '600K Subscribers',
      subscribed: '220 Subscribed',
    }),
    [user],
  )
  const isOwner =
    typeof user.username === 'string' &&
    user.username.toLowerCase() === profile.username.toLowerCase()

  return (
    <div className="mx-auto max-w-[1920px]">
      <ProfileHeader profile={profile} isOwner={isOwner} />
      <div className="border-b border-play-border-subtle px-3 pb-1 sm:px-4">
        <ProfileTabs tabs={PROFILE_TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <section className="px-3 py-4 sm:px-4">
        {activeTab === 'Videos' ? (
          <ProfileVideosTab
            videos={profileVideos}
            canCreate={isOwner}
            onCreateVideo={() => setUploadModalOpen(true)}
          />
        ) : null}
        {activeTab === 'Playlist' ? <ProfilePlaylistsTab playlists={profilePlaylists} /> : null}
        {activeTab === 'Tweets' ? <ProfileTweetsTab tweets={profileTweets} /> : null}
        {activeTab === 'Following' ? <ProfileFollowingTab following={profileFollowing} /> : null}
      </section>

      <UploadVideoModal open={uploadModalOpen && isOwner} onClose={() => setUploadModalOpen(false)} />
    </div>
  )
}

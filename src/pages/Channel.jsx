import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchChannelProfile } from '../api/user.api.js'
import { fetchVideos } from '../api/video.api.js'
import { mapVideoToCard } from '../utils/videoFormat.js'
import { ProfileHeader } from '../components/profile/ProfileHeader.jsx'
import { ProfileVideosTab } from '../components/profile/ProfileVideosTab.jsx'
import { LoadingSpinner } from '../components/Loader.jsx'

export default function Channel() {
  const { username } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isOwner =
    isAuthenticated &&
    typeof user?.username === 'string' &&
    typeof username === 'string' &&
    user.username.toLowerCase() === username.toLowerCase()

  const profile = useMemo(() => {
    if (!channel) return null

    return {
      fullName: channel.fullName || username,
      username: channel.username || username,
      avatar:
        typeof channel.avatar === 'string' && /^https?:\/\//i.test(channel.avatar.trim())
          ? channel.avatar.trim()
          : 'https://i.pravatar.cc/200?img=19',
      subscribers: `${channel.subscriberCount ?? 0} Subscribers`,
      subscribed: `${channel.channelsSubscribedToCount ?? 0} Subscribed`,
    }
  }, [channel, username])

  const loadChannel = useCallback(async () => {
    if (!username) return

    setLoading(true)
    setError('')

    const channelResult = await fetchChannelProfile(username)

    if (!channelResult.success || !channelResult.channel?._id) {
      setError(channelResult.message || 'Channel not found')
      setChannel(null)
      setVideos([])
      setLoading(false)
      return
    }

    setChannel(channelResult.channel)

    const videosResult = await fetchVideos({
      userId: channelResult.channel._id,
      limit: 50,
    })

    setVideos(videosResult.success ? videosResult.videos.map(mapVideoToCard) : [])
    setLoading(false)
  }, [username])

  useEffect(() => {
    loadChannel()
  }, [loadChannel])

  if (loading) return <LoadingSpinner />

  if (error || !profile) {
    return (
      <section className="mx-auto flex min-h-64 max-w-xl flex-col items-center justify-center px-4 text-center">
        <p className="text-lg text-play-muted">{error || 'Channel not found'}</p>
        <Link to="/" className="mt-4 text-play-primary hover:underline">
          Back to home
        </Link>
      </section>
    )
  }

  return (
    <div className="mx-auto max-w-[1920px]">
      <ProfileHeader profile={profile} isOwner={isOwner} />
      <section className="px-3 py-4 sm:px-4">
        <ProfileVideosTab videos={videos} canCreate={false} />
      </section>
    </div>
  )
}

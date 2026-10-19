import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchSubscribedChannels, toggleSubscription } from '../api/subscription.api.js'
import { NoVideosFound } from '../components/empty/NoVideosFound.jsx'
import { LoadingSpinner } from '../components/Loader.jsx'

const DEFAULT_AVATAR = 'https://i.pravatar.cc/80?u=play'

export default function Subscribers() {
  const { isAuthenticated, user } = useAuth()
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !user?._id) return
    let cancelled = false

    async function load() {
      setLoading(true)
      const result = await fetchSubscribedChannels(user._id)
      if (cancelled) return
      if (!result.success) {
        setError(result.message)
        setChannels([])
      } else {
        setChannels(result.channels)
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, user?._id])

  async function handleUnsubscribe(channelId) {
    if (pendingId) return
    setPendingId(channelId)
    setError('')
    const result = await toggleSubscription(channelId)
    if (!result.success) {
      setError(result.message)
    } else {
      setChannels((prev) => prev.filter((channel) => channel._id !== channelId))
    }
    setPendingId(null)
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (loading) return <LoadingSpinner />

  if (error && !channels.length) {
    return <NoVideosFound title="Could not load subscriptions" description={error} />
  }

  if (!channels.length) {
    return (
      <NoVideosFound
        title="No subscriptions yet"
        description="Channels you follow will appear here."
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-play-foreground">Subscribers</h1>
      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      <ul className="mt-6 space-y-3">
        {channels.map((channel) => {
          const avatar =
            typeof channel.avatar === 'string' && channel.avatar.trim()
              ? channel.avatar.trim()
              : DEFAULT_AVATAR
          return (
            <li key={channel._id} className="flex items-center gap-3">
              <Link to={channel.username ? `/c/${channel.username}` : '#'} className="flex min-w-0 flex-1 items-center gap-3 no-underline">
                <img src={avatar} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-md font-semibold text-play-foreground">
                    {channel.fullName || channel.username}
                  </p>
                  {channel.username ? (
                    <p className="truncate text-sm text-play-muted">@{channel.username}</p>
                  ) : null}
                </div>
              </Link>
              <button
                type="button"
                disabled={pendingId === channel._id}
                onClick={() => handleUnsubscribe(channel._id)}
                className="min-w-28 rounded-play-button border border-play-border bg-white px-3 py-1.5 text-sm font-semibold text-black disabled:opacity-60"
              >
                {pendingId === channel._id ? 'Updating…' : 'Subscribed'}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

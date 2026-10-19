import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconSearch } from '../icons/OutlineIcons.jsx'
import { LoadingSpinner } from '../Loader.jsx'

const DEFAULT_AVATAR = 'https://i.pravatar.cc/80?u=play'

export function ProfileFollowingTab({ channels, loading, error, pendingId, onToggle }) {
  const [query, setQuery] = useState('')
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return channels
    return channels.filter((channel) => {
      const name = `${channel.fullName || ''} ${channel.username || ''}`.toLowerCase()
      return name.includes(term)
    })
  }, [channels, query])

  return (
    <div>
      <label className="mb-4 block">
        <span className="relative block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-play-foreground">
            <IconSearch />
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="w-full border border-play-border bg-transparent py-2.5 pl-10 pr-4 text-lg text-play-foreground placeholder:text-play-muted outline-none focus-visible:ring-1 focus-visible:ring-play-ring"
          />
        </span>
      </label>

      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}

      {loading ? (
        <LoadingSpinner layout="section" />
      ) : !visible.length ? (
        <p className="py-10 text-center text-play-muted">
          {channels.length ? 'No channels match that search.' : 'You are not following anyone yet.'}
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((channel) => {
            const avatar =
              typeof channel.avatar === 'string' && channel.avatar.trim()
                ? channel.avatar.trim()
                : DEFAULT_AVATAR
            return (
              <li key={channel._id} className="flex items-center gap-3">
                <Link to={channel.username ? `/c/${channel.username}` : '#'} className="flex min-w-0 flex-1 items-center gap-3 no-underline">
                  <img src={avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
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
                  onClick={() => onToggle(channel._id)}
                  className="min-w-28 rounded-play-button border border-play-border bg-white px-3 py-1.5 text-sm font-semibold text-black disabled:opacity-60"
                >
                  {pendingId === channel._id ? 'Updating…' : 'Subscribed'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconMoreVertical } from '../icons/OutlineIcons.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import SearchBar from '../search/SearchBar.jsx'

function initialsFromUser(user) {
  const name = (user?.fullName || user?.username || '?').trim()
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || '?'
}

function isLikelyImageUrl(avatar) {
  return typeof avatar === 'string' && /^https?:\/\//i.test(avatar.trim())
}

function ProfileAvatar({ user }) {
  const [imgFailed, setImgFailed] = useState(false)
  const src = user?.avatar && isLikelyImageUrl(user.avatar) ? user.avatar.trim() : null

  if (src && !imgFailed) {
    return (
      <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-play-border cursor-pointer">
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setImgFailed(true)}
        />
      </span>
    )
  }

  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-play-border bg-play-surface-elevated text-xs font-semibold uppercase text-play-foreground"
      aria-hidden
    >
      {initialsFromUser(user)}
    </span>
  )
}

function ProfileMenu({ user }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const label = user.fullName || user.username || 'Account menu'

  function handleLogout() {
    setOpen(false)
    logout()
    navigate('/')
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full p-0.5 hover:bg-play-surface-elevated focus-visible:outline focus-visible:ring-2 focus-visible:ring-play-ring"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
      >
        <ProfileAvatar user={user} />
      </button>
      {open ? (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-[calc(100%+0.25rem)] z-30 min-w-44 border border-play-border bg-play-canvas py-1 shadow-[0_8px_24px_rgba(0,0,0,0.65)]"
        >
          <Link
            to="/profile"
            role="menuitem"
            className="block w-full px-4 py-2.5 text-left text-sm font-medium text-play-foreground hover:bg-play-surface-elevated"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            className="block w-full border-t border-play-border-subtle px-4 py-2.5 text-left text-sm font-medium text-play-foreground hover:bg-play-surface-elevated cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  )
}

function PlayLogo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5">
      <div
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{
          background: 'conic-gradient(from 210deg, #f472b6, #a78bfa, #38bdf8, #4ade80, #fbbf24, #f472b6)',
        }}
      >
        <span className="absolute inset-[3px] rounded-full bg-black" />
        <svg
          viewBox="0 0 24 24"
          className="relative z-10 h-4 w-4 text-white"
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 5v14l11-7L8 5z" />
        </svg>
      </div>
      <span className="text-lg font-bold tracking-wide text-play-foreground">PLAY</span>
    </Link>
  )
}

export function AppHeader({ onToggleSidebar }) {
  const { isAuthenticated, user } = useAuth()

  return (
    <header className="z-20 flex h-play-header shrink-0 items-center gap-4 bg-play-canvas px-4 md:px-6">
      <PlayLogo />

      <SearchBar />

      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded p-2 text-play-foreground hover:bg-play-surface-elevated"
          aria-label="Toggle sidebar"
        >
          <IconMoreVertical />
        </button>
        {isAuthenticated && user ? (
          <ProfileMenu user={user} />
        ) : (
          <>
            <Link
              to="/login"
              className="hidden whitespace-nowrap px-2 py-2 text-sm font-medium text-play-foreground hover:text-play-primary sm:inline"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="whitespace-nowrap rounded-play-button bg-play-primary px-4 py-2 text-sm font-semibold text-play-primary-foreground hover:bg-play-primary-hover"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

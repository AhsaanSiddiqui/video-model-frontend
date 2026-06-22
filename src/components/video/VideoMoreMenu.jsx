import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconBolt, IconHelpCircle, IconMoreVertical, IconSettings, IconUser } from '../icons/OutlineIcons.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const fallbackProfile = {
  name: 'Olivia Rhye',
  email: 'olivia@untitledui.com',
  avatar: 'https://i.pravatar.cc/64?img=32',
}

function menuIconClass() {
  return 'h-5 w-5 shrink-0 text-neutral-500'
}

export function VideoMoreMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const { user, isAuthenticated } = useAuth()

  const profile =
    isAuthenticated && user
      ? {
          name: user.fullName || user.username || 'Account',
          email: user.email || '',
          avatar:
            typeof user.avatar === 'string' && /^https?:\/\//i.test(user.avatar.trim())
              ? user.avatar.trim()
              : fallbackProfile.avatar,
        }
      : fallbackProfile

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

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full p-2 text-play-foreground hover:bg-play-surface-elevated"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="More options"
      >
        <IconMoreVertical />
      </button>

      {open ? (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(100vw-2rem,18rem)] rounded-xl border border-neutral-200 bg-white py-2 shadow-2xl ring-1 ring-black/5"
        >
          <div className="border-b border-neutral-100 px-3 pb-3 pt-1">
            <div className="flex gap-3">
              <div className="relative shrink-0">
                <img
                  src={profile.avatar}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover"
                />
                <span
                  className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
                  aria-hidden
                />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="truncate text-sm font-semibold text-neutral-900">{profile.name}</p>
                <p className="truncate text-xs text-neutral-500">{profile.email}</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <Link
              to="/profile"
              role="menuitem"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-800 hover:bg-neutral-50"
              onClick={() => setOpen(false)}
            >
              <IconUser className={menuIconClass()} />
              View profile
            </Link>
            <Link
              to="/settings"
              role="menuitem"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-800 hover:bg-neutral-50"
              onClick={() => setOpen(false)}
            >
              <IconSettings className={menuIconClass()} />
              <span className="flex-1">Settings</span>
              <kbd className="hidden rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-sans text-[10px] font-medium text-neutral-500 sm:inline">
                ⌘S
              </kbd>
            </Link>
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-neutral-800 hover:bg-neutral-50"
              onClick={() => setOpen(false)}
            >
              <IconBolt className={menuIconClass()} />
              <span className="flex-1">Keyboard shortcuts</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 text-xs font-medium text-neutral-500">
                ?
              </span>
            </button>
          </div>

          <div className="border-t border-neutral-100 py-1">
            <Link
              to="/support"
              role="menuitem"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-800 hover:bg-neutral-50"
              onClick={() => setOpen(false)}
            >
              <IconHelpCircle className={menuIconClass()} />
              Support
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}

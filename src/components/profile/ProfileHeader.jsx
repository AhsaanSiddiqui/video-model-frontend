import { Link } from 'react-router-dom'
import { useState } from 'react'
import { IconUserPlus } from '../icons/OutlineIcons.jsx'
import { CropHeaderImageModal } from '../modals/CropHeaderImageModal.jsx'

const DEFAULT_BANNER = 'linear-gradient(to right, #d946ef, #bae6fd, #22d3ee)'

function isImageUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim())
}

export function ProfileHeader({
  profile,
  isOwner,
  onToggleSubscribe,
  subscribePending = false,
}) {
  const [cropOpen, setCropOpen] = useState(false)
  const [bannerStyle, setBannerStyle] = useState(null)
  const cover = isImageUrl(profile.coverImage) ? profile.coverImage.trim() : ''
  const banner = bannerStyle ?? (cover
    ? { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: DEFAULT_BANNER })

  return (
    <>
      <button
        type="button"
        onClick={() => isOwner && setCropOpen(true)}
        className={[
          'h-32 w-full rounded-sm bg-play-surface-elevated',
          isOwner ? 'cursor-pointer transition hover:opacity-90' : 'cursor-default',
        ].join(' ')}
        style={banner}
        aria-label={isOwner ? 'Edit header image' : undefined}
        disabled={!isOwner}
      />
      <section className="border-b border-play-border-subtle px-3 py-5 sm:px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar}
              alt=""
              className="h-24 w-24 shrink-0 rounded-full border-2 border-play-border object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-play-foreground">{profile.fullName}</h1>
              <p className="text-lg text-play-foreground">@{profile.username}</p>
              <p className="mt-1 text-md text-play-muted">
                {profile.subscribers} Subscribers • {profile.subscribed} Subscribed
              </p>
            </div>
          </div>
          {isOwner ? (
            <Link
              to="/settings"
              className="inline-flex items-center justify-center gap-2 self-start rounded-play-button bg-play-primary px-4 py-2 text-md font-medium text-play-primary-foreground no-underline hover:bg-play-primary-hover sm:self-auto"
            >
              <span aria-hidden>✎</span>
              Edit
            </Link>
          ) : (
            <button
              type="button"
              onClick={onToggleSubscribe}
              disabled={subscribePending || !onToggleSubscribe}
              className="inline-flex items-center justify-center gap-2 self-start rounded-play-button bg-play-primary px-4 py-2 text-md font-medium text-play-primary-foreground hover:bg-play-primary-hover disabled:opacity-60 sm:self-auto"
            >
              <IconUserPlus className="h-4! w-4!" />
              {subscribePending ? 'Updating…' : profile.isSubscribed ? 'Subscribed' : 'Follow'}
            </button>
          )}
        </div>
      </section>

      <CropHeaderImageModal
        open={cropOpen}
        onClose={() => setCropOpen(false)}
        onSave={({ gradient }) => setBannerStyle({ background: gradient })}
      />
    </>
  )
}

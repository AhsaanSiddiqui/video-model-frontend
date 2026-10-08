import { useState } from 'react'
import { IconUserPlus } from '../icons/OutlineIcons.jsx'
import { CropHeaderImageModal } from '../modals/CropHeaderImageModal.jsx'

export function ProfileHeader({ profile, isOwner }) {
  const [cropOpen, setCropOpen] = useState(false)
  const [bannerStyle, setBannerStyle] = useState({
    background: 'linear-gradient(to right, #d946ef, #bae6fd, #22d3ee)',
  })

  return (
    <>
      <button
        type="button"
        onClick={() => isOwner && setCropOpen(true)}
        className={[
          'h-32 w-full rounded-sm',
          isOwner ? 'cursor-pointer transition hover:opacity-90' : 'cursor-default',
        ].join(' ')}
        style={bannerStyle}
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
                {profile.subscribers} • {profile.subscribed}
              </p>
            </div>
          </div>
          {isOwner ? (
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 self-start rounded-play-button bg-play-primary px-4 py-2 text-md font-medium text-play-primary-foreground hover:bg-play-primary-hover sm:self-auto"
            >
              <span aria-hidden>✎</span>
              Edit
            </button>
          ) : (
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 self-start rounded-play-button bg-play-primary px-4 py-2 text-md font-medium text-play-primary-foreground hover:bg-play-primary-hover sm:self-auto"
            >
              <IconUserPlus className="h-4! w-4!" />
              Follow
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

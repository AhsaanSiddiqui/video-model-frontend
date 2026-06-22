import { IconUserPlus } from '../icons/OutlineIcons.jsx'

export function ProfileHeader({ profile, isOwner }) {
  return (
    <>
      <div className="h-32 rounded-sm bg-linear-to-r from-fuchsia-500 via-sky-200 to-cyan-400" />
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
    </>
  )
}

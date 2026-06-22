import { IconBolt, IconThumbsDown, IconThumbsUp } from '../icons/OutlineIcons.jsx'

export function ProfileTweetsTab({ tweets }) {
  if (!tweets?.length) {
    return (
      <div>
        <div className="border border-play-border-subtle p-3">
          <textarea
            rows={3}
            placeholder="Write a annoucement"
            className="w-full resize-none border-none bg-transparent text-lg text-play-foreground outline-none placeholder:text-play-muted"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              className="rounded border border-play-border-subtle px-3 py-1 text-sm text-play-muted"
            >
              ☺
            </button>
            <button
              type="button"
              className="rounded border border-play-border-subtle px-3 py-1 text-sm text-play-muted"
            >
              …
            </button>
            <button
              type="button"
              className="rounded-play-button bg-play-primary px-4 py-1.5 text-sm font-semibold text-play-primary-foreground"
            >
              Send
            </button>
          </div>
        </div>

        <div className="mt-10 flex min-h-48 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-play-primary/60 bg-play-surface-elevated">
            <IconBolt className="text-play-primary" />
          </div>
          <h3 className="text-3xl font-semibold text-play-foreground">No Announcements</h3>
          <p className="mt-2 max-w-md text-xl leading-relaxed text-play-muted">
            This page has yet to make an Announcements.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-play-border-subtle border-t border-play-border-subtle">
      {tweets.map((tweet) => (
        <li key={tweet.id} className="py-4">
          <div className="flex gap-3">
            <img
              src="https://i.pravatar.cc/80?img=21"
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-md text-play-foreground">
                <span className="font-semibold">{tweet.author}</span>{' '}
                <span className="text-play-subtle">{tweet.time}</span>
              </p>
              <p className="mt-1 text-md text-play-foreground">{tweet.body}</p>
              <div className="mt-2 flex items-center gap-6 text-sm text-play-muted">
                <span className="inline-flex items-center gap-1">
                  <IconThumbsUp className="h-4! w-4!" />
                  {tweet.likes}
                </span>
                <span className="inline-flex items-center gap-1">
                  <IconThumbsDown className="h-4! w-4!" />
                  {tweet.dislikes}
                </span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

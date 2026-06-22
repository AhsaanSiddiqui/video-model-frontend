import { IconSearch } from '../icons/OutlineIcons.jsx'

export function ProfileFollowingTab({ following }) {
  return (
    <div>
      <label className="mb-4 block">
        <span className="relative block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-play-foreground">
            <IconSearch />
          </span>
          <input
            type="search"
            placeholder="Search"
            className="w-full border border-play-border bg-transparent py-2.5 pl-10 pr-4 text-lg text-play-foreground placeholder:text-play-muted outline-none focus-visible:ring-1 focus-visible:ring-play-ring"
          />
        </span>
      </label>

      <ul className="space-y-3">
        {following.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <img
              src={`https://i.pravatar.cc/64?img=${15 + Number(item.id.slice(1))}`}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-md font-semibold text-play-foreground">{item.name}</p>
              <p className="text-sm text-play-muted">{item.followers}</p>
            </div>
            <button
              type="button"
              className={[
                'min-w-28 rounded-play-button px-3 py-1.5 text-sm font-semibold',
                item.subscribed
                  ? 'border border-play-border bg-white text-black'
                  : 'bg-play-primary text-play-primary-foreground hover:bg-play-primary-hover',
              ].join(' ')}
            >
              {item.subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ProfileTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="mt-7 grid grid-cols-4 gap-2 border-b border-play-border-subtle pb-1">
      {tabs.map((tab) => {
        const active = activeTab === tab
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={[
              'cursor-pointer px-2 py-2 text-center text-md transition',
              active
                ? 'bg-white text-play-primary ring-1 ring-inset ring-play-primary'
                : 'text-play-subtle hover:text-play-foreground',
            ].join(' ')}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}

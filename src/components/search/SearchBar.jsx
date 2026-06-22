import React from 'react'
import { IconSearch } from '../icons/OutlineIcons.jsx'

const SearchBar = () => {
  return (
    <div className="mx-auto flex max-w-2xl flex-1 justify-center px-2">
        <label className="relative w-full max-w-xl">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-play-foreground">
            <IconSearch className="!h-[18px] !w-[18px]" />
            </span>
            <input
            type="search"
            placeholder="Search"
            className="w-full border border-play-border bg-transparent py-2.5 pl-10 pr-4 text-sm text-play-foreground placeholder:text-play-muted outline-none focus-visible:ring-1 focus-visible:ring-play-ring"
            aria-label="Search"
            />
        </label>
    </div>
  )
}

export default SearchBar

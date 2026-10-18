const DEFAULT_AVATAR = 'https://i.pravatar.cc/80?u=play'

export function formatViews(count = 0) {
  const n = Number(count) || 0
  if (n >= 1_000_000) {
    const value = n / 1_000_000
    return `${value >= 10 ? Math.round(value) : value.toFixed(1).replace(/\.0$/, '')}M`
  }
  if (n >= 1_000) {
    const value = n / 1_000
    return `${value >= 10 ? Math.round(value) : value.toFixed(1).replace(/\.0$/, '')}K`
  }
  return String(n)
}

export function formatTimeAgo(dateInput) {
  if (!dateInput) return 'Just now'

  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) return 'Just now'

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'Just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`

  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`

  const years = Math.floor(days / 365)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

export function mapPlaylistCard(playlist) {
  const videos = Array.isArray(playlist?.videos) ? playlist.videos : []
  const populated = videos.filter((video) => video && typeof video === 'object' && video.thumbnail)
  const cover = populated[0]

  return {
    id: playlist?._id ?? playlist?.id,
    title: playlist?.name || playlist?.title || 'Untitled playlist',
    thumbnail: cover?.thumbnail || '',
    videos: `${videos.length} video${videos.length === 1 ? '' : 's'}`,
    views: `${formatViews(populated.reduce((sum, video) => sum + (Number(video.views) || 0), 0))} Views`,
    uploadedAgo: formatTimeAgo(playlist?.updatedAt || playlist?.createdAt),
  }
}

export function mapVideoToCard(video) {
  const owner = video?.owner ?? {}

  return {
    id: video?._id ?? video?.id,
    title: video?.title ?? 'Untitled',
    channel: owner.fullName || owner.username || 'Unknown channel',
    ownerUsername: owner.username,
    views: formatViews(video?.views),
    uploadedAgo: formatTimeAgo(video?.createdAt),
    thumbnail: video?.thumbnail,
    avatar:
      typeof owner.avatar === 'string' && owner.avatar.trim()
        ? owner.avatar.trim()
        : DEFAULT_AVATAR,
  }
}

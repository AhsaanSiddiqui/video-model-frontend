export const PROFILE_TABS = ['Videos', 'Playlist', 'Tweets', 'Following']

export const profileVideos = []

export const profilePlaylists = [
  {
    id: 'pl1',
    title: 'How to choose the right customer for your photo business?',
    ownerUsername: 'YashMittal',
    videos: '32 videos',
    views: '100K Views',
    uploadedAgo: '18 hours ago',
    thumbnail: 'https://picsum.photos/seed/profilep1/960/480',
  },
  {
    id: 'pl2',
    title: 'Terraform, fig & FreeAPI | Updates in Open Source',
    ownerUsername: 'YashMittal',
    videos: '32 videos',
    views: '100K Views',
    uploadedAgo: '18 hours ago',
    thumbnail: 'https://picsum.photos/seed/profilep2/960/480',
  },
]

export const profileTweets = [
  { id: 't1', author: 'Jacob Smith', time: 'Just now', body: 'Great video, waiting for more awesome videos like these.', likes: '18.23K', dislikes: '82.48K' },
  { id: 't2', author: 'Jacob Smith', time: 'Today 07:16', body: 'This course will help lot of people like me to understand react from its core', likes: '53.53K', dislikes: '14.1K' },
  { id: 't3', author: 'Jacob Smith', time: 'Yesterday', body: 'Greatly appreciated your detailed explanation sir', likes: '36.67K', dislikes: '17.78K' },
  { id: 't4', author: 'Jacob Smith', time: 'Yesterday', body: 'Sir this series wil be till advanced with projects right??', likes: '20.31K', dislikes: '26.58K' },
]

export const profileFollowing = [
  { id: 'f1', name: 'Yash Mittal', followers: '11.7K followers', subscribed: false },
  { id: 'f2', name: 'Arya Rose', followers: '110.5K followers', subscribed: true },
  { id: 'f3', name: 'David Lee', followers: '120.1K followers', subscribed: false },
  { id: 'f4', name: 'Finn Willams', followers: '148K followers', subscribed: false },
  { id: 'f5', name: 'Gabriel Rodrigyez', followers: '11.7K followers', subscribed: false },
  { id: 'f6', name: 'Isabella Martinez', followers: '110.5K followers', subscribed: true },
  { id: 'f7', name: 'Jackson Taylor', followers: '120.1K followers', subscribed: false },
]

export const playlistDetailVideos = [
  { id: 'pd1', title: 'Google and Pieces dropped some interesting updates', channel: 'Yash Mittal', views: '100K Views', uploadedAgo: '18 hours ago', thumbnail: 'https://picsum.photos/seed/pd1/420/220' },
  { id: 'pd2', title: 'Terraform, fig & FreeAPI | Updates in Open Source', channel: 'Yash Mittal', views: '100K Views', uploadedAgo: '18 hours ago', thumbnail: 'https://picsum.photos/seed/pd2/420/220' },
  { id: 'pd3', title: 'Deno just got 2M npm packages', channel: 'Yash Mittal', views: '100K Views', uploadedAgo: '18 hours ago', thumbnail: 'https://picsum.photos/seed/pd3/420/220' },
  { id: 'pd4', title: 'How to learn react | A React Roadmap', channel: 'Yash Mittal', views: '100K Views', uploadedAgo: '18 hours ago', thumbnail: 'https://picsum.photos/seed/pd4/420/220' },
  { id: 'pd5', title: "Let's learn react from scratch", channel: 'Yash Mittal', views: '100K Views', uploadedAgo: '18 hours ago', thumbnail: 'https://picsum.photos/seed/pd5/420/220' },
  { id: 'pd6', title: "Google's IDX Unveiled ! Exclusive First Look", channel: 'Yash Mittal', views: '100K Views', uploadedAgo: '18 hours ago', thumbnail: 'https://picsum.photos/seed/pd6/420/220' },
]

export function getPlaylistById(id) {
  return profilePlaylists.find((playlist) => playlist.id === id) || profilePlaylists[0]
}

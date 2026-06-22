/** Static watch-page content — replace with API by videoId. */

export const watchVideoMock = {
  partLabel: 'Part 1: How to get started',
  title: 'Lex Fridman plays Red Dead Redemption 2',
  views: '109,067',
  uploadedAgo: '18 hours ago',
  likes: 2,
  dislikes: 9,
  videoSrc:
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  posterSrc: 'https://picsum.photos/seed/watch-poster/1280/720',
  channel: {
    name: 'Lex Fridman',
    handle: 'lexfridman',
    followers: '705K',
    avatar: 'https://i.pravatar.cc/96?img=33',
  },
  description:
    'Tim Urban is the author of Wait But Why and a long-form writer who explores science, technology, and society. In this conversation we discuss curiosity, writing, and how to think clearly about hard problems.',
};

export const relatedVideosMock = [
  {
    id: 'r1',
    title: 'Building a multi million dollar SaaS in public',
    channel: 'Indie Hackers',
    views: '240K',
    uploadedAgo: '2 days ago',
    thumbnail: 'https://picsum.photos/seed/rel1/320/180',
  },
  {
    id: 'r2',
    title: 'Google and OpenAI dropped new models this week',
    channel: 'AI Explained',
    views: '890K',
    uploadedAgo: '5 hours ago',
    thumbnail: 'https://picsum.photos/seed/rel2/320/180',
  },
  {
    id: 'r3',
    title: 'How database indexes actually work',
    channel: 'System Design',
    views: '412K',
    uploadedAgo: '1 week ago',
    thumbnail: 'https://picsum.photos/seed/rel3/320/180',
  },
  {
    id: 'r4',
    title: 'Rust for JavaScript developers — full guide',
    channel: 'ThePrimeagen',
    views: '1.2M',
    uploadedAgo: '3 weeks ago',
    thumbnail: 'https://picsum.photos/seed/rel4/320/180',
  },
  {
    id: 'r5',
    title: 'Neural networks from scratch — no libraries',
    channel: '3Blue1Brown',
    views: '3.4M',
    uploadedAgo: '2 months ago',
    thumbnail: 'https://picsum.photos/seed/rel5/320/180',
  },
];

export const commentsMock = {
  total: 5034,
  page: 5,
  totalPages: 60,
  items: [
    {
      id: 'c1',
      author: 'Phoenix Baker',
      handle: 'phoenix',
      avatar: 'https://i.pravatar.cc/48?img=12',
      time: 'Just now',
      body: 'This series is exactly what I needed — clear structure and great pacing. More parts please!',
    },
  ],
};

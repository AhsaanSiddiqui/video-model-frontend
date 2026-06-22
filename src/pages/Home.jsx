import VideoCard from '../components/home/VideoCard.jsx'
import { mockVideos } from '../data/homeMockVideos.js'

export default function Home() {
  return (
    <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {mockVideos.map((video) => (
        <VideoCard key={video.id ?? video.title} {...video} />
      ))}
    </div>
  )
}

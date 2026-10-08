import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { UploadAndAttachFilesModal } from '../components/modals/UploadAndAttachFilesModal'
import { EditVideoModal } from '../components/modals/EditVideoModal'
import { DeleteVideoModal } from '../components/modals/DeleteVideoModal'
import { IconEye, IconHeart, IconPencil, IconTrash, IconUserCheck } from '../components/icons/OutlineIcons.jsx'

const STATS = {
  views: 221_234,
  followers: 4_053,
  likes: 63_021,
}

const INITIAL_ROWS = [
  {
    id: '1',
    title: 'Cardi B - WAP ft. Megan Thee Sta…',
    thumb: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop',
    published: true,
    likes: 367,
    dislikes: 4767,
    date: '9/23/16',
  },
  {
    id: '2',
    title: 'H.E.R. - Damage (Official Video)',
    thumb: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=80&h=80&fit=crop',
    published: false,
    likes: 1204,
    dislikes: 89,
    date: '10/21/20',
  },
  {
    id: '3',
    title: 'Summer Walker - Playing Games',
    thumb: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=80&h=80&fit=crop',
    published: true,
    likes: 8921,
    dislikes: 312,
    date: '8/2/19',
  },
]

function formatCount(n) {
  return n.toLocaleString('en-US')
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-play-border bg-play-canvas p-5">
      <div className="flex size-11 items-center justify-center rounded-full bg-play-primary/15 text-play-primary [&_svg]:size-6">
        <Icon />
      </div>
      <div>
        <p className="text-sm text-play-muted">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-play-foreground">{formatCount(value)}</p>
      </div>
    </div>
  )
}

function ToggleSwitch({ checked, onChange, id }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? 'Video visible' : 'Video hidden'}
      id={id}
      onClick={() => onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-play-ring focus-visible:ring-offset-2 focus-visible:ring-offset-play-canvas',
        checked ? 'border-play-primary bg-play-primary' : 'border-play-border bg-play-surface-elevated',
      ].join(' ')}
    >
      <span
        className={[
          'pointer-events-none absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [editVideo, setEditVideo] = useState(null)
  const [deleteVideo, setDeleteVideo] = useState(null)
  const [rows, setRows] = useState(INITIAL_ROWS)

  const firstName = useMemo(() => {
    const name = user?.fullName?.trim()
    if (name) return name.split(/\s+/)[0]
    if (user?.username) return user.username
    return 'Olivia'
  }, [user])

  function handleEditFinish(updates) {
    if (!editVideo) return
    setRows((prev) =>
      prev.map((row) =>
        row.id === editVideo.id
          ? { ...row, title: updates.title || row.title, description: updates.description, thumb: updates.thumbnail || row.thumb }
          : row,
      ),
    )
  }

  function handleDeleteConfirm() {
    if (!deleteVideo) return
    setRows((prev) => prev.filter((row) => row.id !== deleteVideo.id))
  }

  function setPublished(id, published) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, published } : r)))
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-8 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-play-foreground sm:text-4xl">Welcome back, {firstName}</h1>
          <p className="mt-2 max-w-xl text-sm text-play-muted sm:text-base">Track, manage and forecast your customers and orders.</p>
        </div>
        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-play-primary px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-play-ring focus-visible:ring-offset-2 focus-visible:ring-offset-play-canvas"
        >
          <span aria-hidden>+</span>
          Upload Video
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Views" value={STATS.views} icon={IconEye} />
        <StatCard label="Total Followers" value={STATS.followers} icon={IconUserCheck} />
        <StatCard label="Total Likes" value={STATS.likes} icon={IconHeart} />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-play-border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm text-play-foreground">
            <thead>
              <tr className="border-b border-play-border bg-play-surface-elevated/50">
                <th className="w-14 px-3 py-3 font-medium text-play-muted" scope="col">
                  <span className="sr-only">Visibility</span>
                </th>
                <th className="px-3 py-3 font-medium text-play-muted" scope="col">
                  Status
                </th>
                <th className="min-w-[200px] px-3 py-3 font-medium text-play-muted" scope="col">
                  Uploaded
                </th>
                <th className="w-[140px] px-0 py-0 font-medium text-play-muted" scope="col">
                  <span className="block bg-white px-3 py-3 text-play-muted">Rating</span>
                </th>
                <th className="px-3 py-3 font-medium text-play-muted" scope="col">
                  Date uploaded
                </th>
                <th className="w-24 px-3 py-3 text-right font-medium text-play-muted" scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-play-border last:border-b-0">
                  <td className="px-3 py-3 align-middle">
                    <ToggleSwitch
                      id={`vis-${row.id}`}
                      checked={row.published}
                      onChange={(v) => setPublished(row.id, v)}
                    />
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <span
                      className={[
                        'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium',
                        row.published
                          ? 'border-emerald-500/80 text-emerald-400'
                          : 'border-amber-500/80 text-amber-400',
                      ].join(' ')}
                    >
                      {row.published ? 'Published' : 'Unpublished'}
                    </span>
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <img src={row.thumb} alt="" className="size-10 shrink-0 rounded-full object-cover" width={40} height={40} />
                      <span className="line-clamp-2 font-medium">{row.title}</span>
                    </div>
                  </td>
                  <td className="align-middle bg-white p-0">
                    <div className="flex flex-col gap-0.5 px-3 py-3 text-xs sm:text-sm">
                      <span className="font-medium text-emerald-600">{formatCount(row.likes)} likes</span>
                      <span className="font-medium text-red-600">{formatCount(row.dislikes)} Dislikes</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 align-middle text-play-muted">{row.date}</td>
                  <td className="px-3 py-3 align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setDeleteVideo(row)}
                        className="rounded p-1.5 text-play-foreground transition hover:bg-play-surface-elevated focus-visible:outline focus-visible:ring-2 focus-visible:ring-play-ring"
                        aria-label={`Delete ${row.title}`}
                      >
                        <IconTrash />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditVideo(row)}
                        className="rounded p-1.5 text-play-foreground transition hover:bg-play-surface-elevated focus-visible:outline focus-visible:ring-2 focus-visible:ring-play-ring"
                        aria-label={`Edit ${row.title}`}
                      >
                        <IconPencil />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UploadAndAttachFilesModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <EditVideoModal
        open={!!editVideo}
        video={editVideo}
        onClose={() => setEditVideo(null)}
        onFinish={handleEditFinish}
      />
      <DeleteVideoModal
        open={!!deleteVideo}
        videoTitle={deleteVideo?.title}
        onClose={() => setDeleteVideo(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

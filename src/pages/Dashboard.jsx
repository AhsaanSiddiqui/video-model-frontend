import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchDashboardStats, fetchDashboardVideos } from '../api/dashboard.api.js'
import { deleteVideo, togglePublishVideo, updateVideo } from '../api/video.api.js'
import { UploadVideoModal } from '../components/modals/UploadVideoModal'
import { EditVideoModal } from '../components/modals/EditVideoModal'
import { DeleteVideoModal } from '../components/modals/DeleteVideoModal'
import { IconEye, IconHeart, IconPencil, IconTrash, IconUserCheck } from '../components/icons/OutlineIcons.jsx'

function formatCount(n) {
  return Number(n || 0).toLocaleString('en-US')
}

function mapRow(video) {
  const created = video?.createdAt ? new Date(video.createdAt) : null
  return {
    id: video?._id,
    title: video?.title || 'Untitled',
    description: video?.description || '',
    thumb: video?.thumbnail || '',
    published: Boolean(video?.isPublished),
    likes: video?.likes ?? 0,
    dislikes: video?.dislikes ?? 0,
    date: created && !Number.isNaN(created.getTime()) ? created.toLocaleDateString('en-US') : '',
  }
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

function ToggleSwitch({ checked, onChange, id, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? 'Video visible' : 'Video hidden'}
      id={id}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-play-ring focus-visible:ring-offset-2 focus-visible:ring-offset-play-canvas disabled:opacity-60',
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
  const { user, isAuthenticated } = useAuth()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [editVideo, setEditVideo] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState({ views: 0, followers: 0, likes: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState(null)

  const firstName = useMemo(() => {
    const name = user?.fullName?.trim()
    if (name) return name.split(/\s+/)[0]
    if (user?.username) return user.username
    return 'Olivia'
  }, [user])

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError('')
    const [statsResult, videosResult] = await Promise.all([fetchDashboardStats(), fetchDashboardVideos()])

    if (!statsResult.success && !videosResult.success) {
      setError(statsResult.message || videosResult.message)
    } else if (!videosResult.success) {
      setError(videosResult.message)
    }

    setStats(statsResult.stats)
    setRows(videosResult.videos.map(mapRow))
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    loadDashboard()
  }, [isAuthenticated, loadDashboard])

  async function handleEditFinish(updates) {
    if (!editVideo) return { success: false, message: 'No video selected' }
    const result = await updateVideo(editVideo.id, {
      title: updates.title,
      description: updates.description,
      thumbnail: updates.thumbnailFile,
    })
    if (!result.success) return result

    const next = result.video ? mapRow({ ...result.video, likes: editVideo.likes, dislikes: editVideo.dislikes }) : null
    setRows((prev) =>
      prev.map((row) =>
        row.id === editVideo.id
          ? {
              ...row,
              ...(next || {}),
              title: updates.title || row.title,
              description: updates.description ?? row.description,
              thumb: next?.thumb || row.thumb,
            }
          : row,
      ),
    )
    return result
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    const result = await deleteVideo(deleteTarget.id)
    if (!result.success) {
      setError(result.message)
      return
    }
    setRows((prev) => prev.filter((row) => row.id !== deleteTarget.id))
    fetchDashboardStats().then((statsResult) => {
      if (statsResult.success) setStats(statsResult.stats)
    })
  }

  async function setPublished(id, published) {
    const previous = rows.find((row) => row.id === id)
    if (!previous || pendingId) return

    setPendingId(id)
    setError('')
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, published } : row)))

    const result = await togglePublishVideo(id)
    if (!result.success) {
      setRows((prev) => prev.map((row) => (row.id === id ? previous : row)))
      setError(result.message)
    } else if (result.video && typeof result.video.isPublished === 'boolean') {
      setRows((prev) => prev.map((row) => (row.id === id ? { ...row, published: result.video.isPublished } : row)))
    }
    setPendingId(null)
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
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

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Views" value={stats.views} icon={IconEye} />
        <StatCard label="Total Followers" value={stats.followers} icon={IconUserCheck} />
        <StatCard label="Total Likes" value={stats.likes} icon={IconHeart} />
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-play-muted">
                    Loading your videos…
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-play-border last:border-b-0">
                    <td className="px-3 py-3 align-middle">
                      <ToggleSwitch
                        id={`vis-${row.id}`}
                        checked={row.published}
                        disabled={pendingId === row.id}
                        onChange={(value) => setPublished(row.id, value)}
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
                          onClick={() => setDeleteTarget(row)}
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
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-play-muted">
                    No videos uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UploadVideoModal open={uploadOpen} onClose={() => setUploadOpen(false)} onSuccess={loadDashboard} />
      <EditVideoModal
        open={!!editVideo}
        video={editVideo}
        onClose={() => setEditVideo(null)}
        onFinish={handleEditFinish}
      />
      <DeleteVideoModal
        open={!!deleteTarget}
        videoTitle={deleteTarget?.title}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

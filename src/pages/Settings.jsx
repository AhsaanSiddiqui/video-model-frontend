import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { PlayTextField } from '../components/auth/PlayTextField.jsx'
import { PlayFileField } from '../components/auth/PlayFileField.jsx'
import { getCurrentUser, updateAccountDetails, updateAvatar, updateCoverImage } from '../api/auth.api.js'

function userFromBody(body) {
  const data = body?.data
  const message = body?.message
  if (data && typeof data === 'object' && (data._id || data.email)) return data
  if (message && typeof message === 'object' && (message._id || message.email)) return message
  return null
}

function isImageUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim())
}

function Notice({ tone, children }) {
  const styles =
    tone === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-green-200 bg-green-50 text-green-700'
  return <p className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>{children}</p>
}

export default function Settings() {
  const { isAuthenticated, user, saveUser } = useAuth()
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState('')
  const [accountStatus, setAccountStatus] = useState({ error: '', success: '' })
  const [avatarStatus, setAvatarStatus] = useState({ error: '', success: '' })
  const [coverStatus, setCoverStatus] = useState({ error: '', success: '' })
  const [savingAccount, setSavingAccount] = useState(false)
  const [savingAvatar, setSavingAvatar] = useState(false)
  const [savingCover, setSavingCover] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false

    async function load() {
      const body = await getCurrentUser()
      const fresh = userFromBody(body)
      if (cancelled || !fresh) return
      saveUser(fresh)
      setFullName(fresh.fullName || '')
      setEmail(fresh.email || '')
    }

    load()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, saveUser])

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview('')
      return
    }
    const url = URL.createObjectURL(avatarFile)
    setAvatarPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [avatarFile])

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview('')
      return
    }
    const url = URL.createObjectURL(coverFile)
    setCoverPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [coverFile])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const avatarSrc = avatarPreview || (isImageUrl(user?.avatar) ? user.avatar.trim() : '')
  const coverSrc = coverPreview || (isImageUrl(user?.coverImage) ? user.coverImage.trim() : '')

  async function handleAccount(event) {
    event.preventDefault()
    setSavingAccount(true)
    setAccountStatus({ error: '', success: '' })
    const result = await updateAccountDetails({ fullName: fullName.trim(), email: email.trim() })
    if (!result.success || !result.user) {
      setAccountStatus({ error: result.message || 'Could not update account.', success: '' })
    } else {
      saveUser({ ...user, ...result.user })
      setAccountStatus({ error: '', success: result.message || 'Account updated.' })
    }
    setSavingAccount(false)
  }

  async function handleAvatar(event) {
    event.preventDefault()
    if (!avatarFile) return
    setSavingAvatar(true)
    setAvatarStatus({ error: '', success: '' })
    const result = await updateAvatar(avatarFile)
    if (!result.success || !result.user) {
      setAvatarStatus({ error: result.message || 'Could not update avatar.', success: '' })
    } else {
      saveUser({ ...user, ...result.user })
      setAvatarFile(null)
      setAvatarStatus({ error: '', success: result.message || 'Avatar updated.' })
    }
    setSavingAvatar(false)
  }

  async function handleCover(event) {
    event.preventDefault()
    if (!coverFile) return
    setSavingCover(true)
    setCoverStatus({ error: '', success: '' })
    const result = await updateCoverImage(coverFile)
    if (!result.success || !result.user) {
      setCoverStatus({ error: result.message || 'Could not update cover image.', success: '' })
    } else {
      saveUser({ ...user, ...result.user })
      setCoverFile(null)
      setCoverStatus({ error: '', success: result.message || 'Cover image updated.' })
    }
    setSavingCover(false)
  }

  return (
    <div className="mx-auto max-w-3xl text-play-foreground">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="mt-2 text-sm text-play-muted">Update your name, email, avatar, and cover image.</p>

      <form onSubmit={handleAccount} className="mt-8 space-y-5 border border-play-border-subtle p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Account</h2>
        {accountStatus.error ? <Notice tone="error">{accountStatus.error}</Notice> : null}
        {accountStatus.success ? <Notice tone="success">{accountStatus.success}</Notice> : null}
        <PlayTextField
          label="Full name"
          id="settings-name"
          name="fullName"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
        />
        <PlayTextField
          label="Email"
          id="settings-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <p className="text-sm text-play-muted">Username: @{user?.username}</p>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={savingAccount || !fullName.trim() || !email.trim()}
            className="rounded-play-button bg-play-primary px-4 py-2 text-sm font-semibold text-play-primary-foreground hover:bg-play-primary-hover disabled:opacity-50"
          >
            {savingAccount ? 'Saving…' : 'Save account'}
          </button>
          <Link to="/change-password" className="text-sm font-medium text-play-primary hover:underline">
            Change password
          </Link>
        </div>
      </form>

      <form onSubmit={handleAvatar} className="mt-6 space-y-4 border border-play-border-subtle p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Avatar</h2>
        {avatarStatus.error ? <Notice tone="error">{avatarStatus.error}</Notice> : null}
        {avatarStatus.success ? <Notice tone="success">{avatarStatus.success}</Notice> : null}
        {avatarSrc ? (
          <img src={avatarSrc} alt="" className="h-20 w-20 rounded-full object-cover" />
        ) : null}
        <PlayFileField
          label="Profile image"
          id="settings-avatar"
          name="avatar"
          onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
        />
        <button
          type="submit"
          disabled={savingAvatar || !avatarFile}
          className="rounded-play-button bg-play-primary px-4 py-2 text-sm font-semibold text-play-primary-foreground hover:bg-play-primary-hover disabled:opacity-50"
        >
          {savingAvatar ? 'Uploading…' : 'Update avatar'}
        </button>
      </form>

      <form onSubmit={handleCover} className="mt-6 space-y-4 border border-play-border-subtle p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Cover image</h2>
        {coverStatus.error ? <Notice tone="error">{coverStatus.error}</Notice> : null}
        {coverStatus.success ? <Notice tone="success">{coverStatus.success}</Notice> : null}
        {coverSrc ? (
          <img src={coverSrc} alt="" className="aspect-video w-full max-w-xl object-cover" />
        ) : (
          <p className="text-sm text-play-muted">No cover image yet.</p>
        )}
        <PlayFileField
          label="Cover image"
          id="settings-cover"
          name="coverImage"
          onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
        />
        <button
          type="submit"
          disabled={savingCover || !coverFile}
          className="rounded-play-button bg-play-primary px-4 py-2 text-sm font-semibold text-play-primary-foreground hover:bg-play-primary-hover disabled:opacity-50"
        >
          {savingCover ? 'Uploading…' : 'Update cover'}
        </button>
      </form>
    </div>
  )
}

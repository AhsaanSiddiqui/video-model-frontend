import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { PlayTextField } from '../components/auth/PlayTextField.jsx'
import { PlayPrimaryButton } from '../components/auth/PlayPrimaryButton.jsx'
import { changePassword } from '../api/auth.api.js'

export default function ChangePassword() {
  const { isAuthenticated } = useAuth()
  const [fields, setFields] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await changePassword({
        oldPassword: fields.oldPassword,
        newPassword: fields.newPassword,
        confirmPassword: fields.confirmPassword,
      })
      if (!res?.success) {
        setError(res?.message || 'Could not update password.')
        return
      }
      setSuccess(res?.message || 'Password changed successfully.')
      setFields({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md text-play-foreground">
      <h1 className="text-2xl font-bold tracking-tight">Change password</h1>
      <p className="mt-2 text-sm text-play-muted">
        Use your current password, then choose a new one (at least 6 characters).
      </p>

      <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
            <div className="font-semibold">Error</div>
            <div>{error}</div>
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-sm">
            <div className="font-semibold">Success</div>
            <div>{success}</div>
          </div>
        )}

        <PlayTextField
          label="Current password*"
          id="change-old"
          name="oldPassword"
          type="password"
          placeholder="Current password"
          autoComplete="current-password"
          value={fields.oldPassword}
          onChange={handleChange}
        />
        <PlayTextField
          label="New password*"
          id="change-new"
          name="newPassword"
          type="password"
          placeholder="At least 6 characters"
          autoComplete="new-password"
          value={fields.newPassword}
          onChange={handleChange}
        />
        <PlayTextField
          label="Confirm new password*"
          id="change-confirm"
          name="confirmPassword"
          type="password"
          placeholder="Repeat new password"
          autoComplete="new-password"
          value={fields.confirmPassword}
          onChange={handleChange}
        />

        <PlayPrimaryButton disabled={loading}>
          {loading ? 'Updating…' : 'Update password'}
        </PlayPrimaryButton>

        <p className="text-center text-sm text-play-muted">
          <Link
            to="/profile"
            className="font-medium text-play-foreground underline-offset-4 hover:text-play-primary hover:underline"
          >
            Back to profile
          </Link>
        </p>
      </form>
    </div>
  )
}

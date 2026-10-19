import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { PlayAuthLayout } from '../components/auth/PlayAuthLayout.jsx'
import { PlayTextField } from '../components/auth/PlayTextField.jsx'
import { PlayPrimaryButton } from '../components/auth/PlayPrimaryButton.jsx'
import { resetPasswordWithToken } from '../api/auth.api.js'
import { LoadingSpinner } from '../components/Loader.jsx'

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate()

  const [fields, setFields] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
      const res = await resetPasswordWithToken({
        token,
        newPassword: fields.newPassword,
        confirmPassword: fields.confirmPassword,
      })
      if (!res?.success) {
        setError(res?.message || 'Reset failed. Try again.')
        return
      }
      setSuccess(res?.message || 'Password updated.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <PlayAuthLayout>
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Missing reset token. Use the link from your email (or the dev link from forgot
          password).
        </div>
        <p className="text-center text-sm text-play-muted">
          <Link
            to="/forgot-password"
            className="font-medium text-play-foreground underline-offset-4 hover:text-play-primary hover:underline"
          >
            Request a new link
          </Link>
        </p>
      </PlayAuthLayout>
    )
  }

  return (
    <PlayAuthLayout>
      <p className="text-center text-sm text-play-muted">Choose a new password for your account.</p>
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
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
          label="New password*"
          id="reset-new"
          name="newPassword"
          type="password"
          placeholder="At least 6 characters"
          autoComplete="new-password"
          value={fields.newPassword}
          onChange={handleChange}
        />
        <PlayTextField
          label="Confirm password*"
          id="reset-confirm"
          name="confirmPassword"
          type="password"
          placeholder="Repeat password"
          autoComplete="new-password"
          value={fields.confirmPassword}
          onChange={handleChange}
        />
        <PlayPrimaryButton disabled={loading}>
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <LoadingSpinner layout="inline" />
              Saving…
            </span>
          ) : (
            'Update password'
          )}
        </PlayPrimaryButton>
        <p className="text-center text-sm text-play-muted">
          <Link
            to="/login"
            className="font-medium text-play-foreground underline-offset-4 hover:text-play-primary hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </PlayAuthLayout>
  )
}

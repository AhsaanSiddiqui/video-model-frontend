import { Link } from 'react-router-dom'
import { useState } from 'react'
import { PlayAuthLayout } from '../components/auth/PlayAuthLayout.jsx'
import { PlayTextField } from '../components/auth/PlayTextField.jsx'
import { PlayPrimaryButton } from '../components/auth/PlayPrimaryButton.jsx'
import { forgotPassword } from '../api/auth.api.js'
import { LoadingSpinner } from '../components/Loader.jsx'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [devResetLink, setDevResetLink] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    setDevResetLink('')

    try {
      const res = await forgotPassword(email.trim())
      if (!res?.success) {
        setError(res?.message || 'Request failed. Try again.')
        return
      }
      setSuccess(res?.message || 'Check your email for next steps.')
      
      console.log(res.data.setDevResetLink)
      if (res?.data?.resetLink) {
        setDevResetLink(res.data.resetLink)
        // console.log(res.data)
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong.')

    } finally {
      setLoading(false)
    }
  }

  return (
    <PlayAuthLayout>
      <p className="text-center text-sm text-play-muted">
        Enter your account email. We will send reset instructions if an account exists.
      </p>
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
            <div className="font-semibold">Error</div>
            <div>{error}</div>
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-sm">
            <div className="font-semibold">Done</div>
            <div>{success}</div>
          </div>
        )}
        {devResetLink && (
          <div className="rounded-xl border border-play-border bg-play-surface-elevated px-4 py-3 text-xs text-play-muted">
            <div className="font-semibold text-play-foreground">Development</div>
            <p className="mt-1 break-all">
              No email is configured. Open this link to set a new password:
            </p>
            <a
              href={devResetLink}
              className="mt-2 inline-block font-medium text-play-primary underline-offset-2 hover:underline"
            >
              Reset password
            </a>
          </div>
        )}
        <PlayTextField
          label="Email*"
          id="forgot-email"
          name="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PlayPrimaryButton disabled={loading}>
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <LoadingSpinner layout="inline" />
              Sending…
            </span>
          ) : (
            'Send reset link'
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

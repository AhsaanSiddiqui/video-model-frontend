import { Link } from 'react-router-dom'
import { PlayAuthLayout } from '../components/auth/PlayAuthLayout.jsx'
import { PlayTextField } from '../components/auth/PlayTextField.jsx'
import { PlayFileField } from '../components/auth/PlayFileField.jsx'
import { PlayPrimaryButton } from '../components/auth/PlayPrimaryButton.jsx'
import { useState } from 'react'
import { registerUser } from '../api/auth.api.js'
import { useNavigate } from 'react-router-dom'

/** Layout only — no registration or API wiring. */
export default function Signup() {
  const [fields, setFields] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    avatar: null,
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    setFields((prev) => {
      if (files) {
        return { ...prev, [name]: files[0] }
      } else {
        return { ...prev, [name]: value }
      }

    })
  }
// console.log("Hello")
  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await registerUser(fields)

      if (!res?.success) {
        setError(res?.message || 'Signup failed. Please try again.')
      } else {
        setSuccess(res?.message || 'Account created successfully.')

        // Redirect to login after a short delay to show success message
        setTimeout(() => {
          navigate('/login')
        })
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PlayAuthLayout>
      <form
        className="space-y-5"
        // noValidate
        onSubmit={handleSubmit}
      >

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
            <div className="font-semibold">Signup failed</div>
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
          label="Full name*"
          id="signup-fullName"
          name="fullName"
          placeholder="Your name"
          autoComplete="name"
          value={fields.fullName}
          onChange={handleInputChange}
        />
        <PlayTextField
          label="Username*"
          id="signup-username"
          name="username"
          placeholder="e.g. my_channel_12"
          title="3–20 chars: lowercase letters, numbers, underscore only"
          autoComplete="username"
          value={fields.username}
          onChange={handleInputChange}
        />
        <PlayTextField
          label="Email*"
          id="signup-email"
          name="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          value={fields.email}
          onChange={handleInputChange}
        />
        <PlayTextField
          label="Password*"
          id="signup-password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={fields.password}
          onChange={handleInputChange}
        />
        <PlayFileField label="Profile photo*" id="signup-avatar" name="avatar" value={fields.avatar} onChange={handleInputChange} />

        <PlayPrimaryButton type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </PlayPrimaryButton>

        <p className="text-center text-sm text-play-muted">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-play-foreground underline-offset-4 hover:text-play-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </PlayAuthLayout>
  )
}

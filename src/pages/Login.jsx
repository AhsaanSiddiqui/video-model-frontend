import { Link } from 'react-router-dom'
import { PlayAuthLayout } from '../components/auth/PlayAuthLayout.jsx'
import { PlayTextField } from '../components/auth/PlayTextField.jsx'
import { PlayPrimaryButton } from '../components/auth/PlayPrimaryButton.jsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth.api.js'
import { useAuth } from '../context/AuthContext.jsx'

/** Layout only — no auth or API wiring. */
export default function Login() {
  const { setUser, setIsAuthenticated } = useAuth()
  const [fields, setFields] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate()



  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    console.log(fields)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(fields)
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await loginUser(fields)

      if (!res.success) {
        setError(res?.message || 'Login failed. Please try again.');
        return
      } else {
        setSuccess(res?.message || 'Login successful.')
      }

      if(res?.data?.accessToken) {
        // Store token in localStorage (or context/state management)
        localStorage.setItem('accessToken', res.data.accessToken);
      }
      if(res?.data?.refreshToken) {
        // Store token in localStorage (or context/state management) 
        localStorage.setItem('refreshToken', res.data.refreshToken);
      }
      if (res?.data?.user) {
        localStorage.setItem('currentUser', JSON.stringify(res.data.user))
        setUser(res.data.user)
        setIsAuthenticated(true)
      }

      setTimeout(() => {
        navigate('/')
      })

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
        noValidate
        onSubmit={handleSubmit}
      >

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
            <div className="font-semibold">Login failed</div>
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-sm">
            <div className="font-semibold">Login successful</div>
            <div>{success}</div>
          </div>
        )}

        <PlayTextField
          label="Email*"
          id="login-email"
          name="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          value={fields.email}
          onChange={handleInputChange}
        />
        <PlayTextField
          label="Password*"
          id="login-password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={fields.password}
          onChange={handleInputChange}
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-play-muted underline-offset-4 hover:text-play-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <PlayPrimaryButton>Sign in</PlayPrimaryButton>

        <p className="text-center text-sm text-play-muted">
          No account?{' '}
          <Link
            to="/signup"
            className="font-medium text-play-foreground underline-offset-4 hover:text-play-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </PlayAuthLayout>
  )
}

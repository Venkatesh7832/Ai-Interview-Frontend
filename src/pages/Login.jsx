import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { login } from '../services/authService'

export default function Login() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/dashboard'

  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await login(form)   // ✅ FIXED

      localStorage.setItem("interviewai_token", res.data.token)

      navigate(from, { replace: true })

    } catch (err) {
      console.error(err)

      if (err.response?.status === 401) {
        setError("Invalid email or password")
      } else {
        setError(err.response?.data?.message || "Something went wrong")
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-logo">◈ InterviewAI</div>
          <h1 className="auth-headline">Ace your next<br/>technical interview.</h1>
          <p className="auth-sub">AI-powered question sessions with real-time feedback and scoring.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-card-title">Welcome back</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>

          </form>

          <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  )
}
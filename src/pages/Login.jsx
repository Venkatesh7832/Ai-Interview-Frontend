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
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.'
      setError(msg)
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
          <div className="auth-stats">
            <div className="stat"><span className="stat-n">16+</span><span className="stat-l">Questions</span></div>
            <div className="stat"><span className="stat-n">AI</span><span className="stat-l">Feedback</span></div>
            <div className="stat"><span className="stat-n">∞</span><span className="stat-l">Practice</span></div>
          </div>
        </div>
        <div className="auth-bg-grid" aria-hidden="true" />
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-card-title">Welcome back</h2>
          <p className="auth-card-sub">Sign in to continue your practice</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Sign in'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

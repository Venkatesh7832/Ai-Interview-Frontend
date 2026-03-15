import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const data = err.response?.data
      if (data?.fieldErrors) {
        const msgs = Object.values(data.fieldErrors).join(' ')
        setError(msgs)
      } else {
        setError(data?.message || 'Registration failed. Please try again.')
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
          <h1 className="auth-headline">Your interview<br/>coach, powered<br/>by AI.</h1>
          <p className="auth-sub">Register once. Practice forever. Get smarter every session.</p>
          <div className="auth-features">
            {['Instant AI scoring', 'Detailed feedback', 'Follow-up questions', 'Progress tracking'].map(f => (
              <div key={f} className="feature-pill">✓ {f}</div>
            ))}
          </div>
        </div>
        <div className="auth-bg-grid" aria-hidden="true" />
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-card-title">Create account</h2>
          <p className="auth-card-sub">Start your AI interview practice today</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name" name="name" type="text"
                placeholder="Jane Smith"
                value={form.name} onChange={handleChange} required
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email" name="email" type="email"
                placeholder="you@example.com"
                value={form.email} onChange={handleChange} required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password" name="password" type="password"
                placeholder="Min. 8 characters"
                value={form.password} onChange={handleChange} required
              />
            </div>

            <div className="field">
              <label htmlFor="confirm">Confirm password</label>
              <input
                id="confirm" name="confirm" type="password"
                placeholder="Repeat password"
                value={form.confirm} onChange={handleChange} required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

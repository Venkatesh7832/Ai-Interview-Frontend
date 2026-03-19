import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await register({
        name: form.name,
        email: form.email,
        password: form.password
      }) // ✅ FIXED

      localStorage.setItem("interviewai_token", res.data.token)

      navigate('/dashboard', { replace: true })

    } catch (err) {
      console.error(err)

      setError(err.response?.data?.message || 'Registration failed')

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-right">
        <div className="auth-card">

          <h2>Create Account</h2>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleSubmit}>

            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
            <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Confirm Password" required />

            <button type="submit">
              {loading ? "Creating..." : "Register"}
            </button>

          </form>

          <Link to="/login">Login</Link>

        </div>
      </div>
    </div>
  )
}
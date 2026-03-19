import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getUser, clearAuth } from '../utils/auth'

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const user      = getUser()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <span className="brand-icon">◈</span>
        <span className="brand-text">InterviewAI</span>
      </Link>

      <div className="navbar-links">
        <Link to="/dashboard"  className={`nav-link ${isActive('/dashboard')  ? 'active' : ''}`}>Dashboard</Link>
        <Link to="/practice"   className={`nav-link ${isActive('/practice')   ? 'active' : ''}`}>Practice</Link>
        <Link to="/results"    className={`nav-link ${isActive('/results')    ? 'active' : ''}`}>Results</Link>
      </div>

      <div className="navbar-user">
        <span className="user-chip">
          <span className="user-avatar">{user?.name?.[0]?.toUpperCase() ?? '?'}</span>
          <span className="user-name">{user?.name ?? 'User'}</span>
        </span>
        <button className="btn-logout" onClick={handleLogout}>Sign out</button>
      </div>
    </nav>
  )
}

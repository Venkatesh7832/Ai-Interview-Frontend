import { Link } from 'react-router-dom'
import { isAuthenticated } from '../utils/auth'

export default function NotFound() {
  const dest = isAuthenticated() ? '/dashboard' : '/login'

  return (
    <div className="error-boundary">
      <div className="error-boundary-card">
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 64, color: 'var(--text-3)', lineHeight: 1 }}>
          404
        </p>
        <h2 className="error-boundary-title">Page not found</h2>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, textAlign: 'center' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to={dest} className="btn-primary" style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}>
          Back to {isAuthenticated() ? 'Dashboard' : 'Login'} →
        </Link>
      </div>
    </div>
  )
}

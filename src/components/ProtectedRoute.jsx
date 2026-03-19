import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../utils/auth'
import { clearAuth } from '../utils/auth' // ✅ unified cleanup for auth state

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

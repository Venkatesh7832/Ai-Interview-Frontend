import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login          from './pages/Login'
import Register       from './pages/Register'
import Dashboard      from './pages/Dashboard'
import Practice       from './pages/Practice'
import Results        from './pages/Results'
import NotFound       from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {

  const token = localStorage.getItem("interviewai_token");
  
  return (
    <BrowserRouter>
      <Routes>


        {/* ✅ DEFAULT ROUTE */}
        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ PROTECTED DASHBOARD */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Protected */}
        <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/practice"     element={<ProtectedRoute><Practice /></ProtectedRoute>} />
        <Route path="/practice/:id" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
        <Route path="/results"      element={<ProtectedRoute><Results /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}



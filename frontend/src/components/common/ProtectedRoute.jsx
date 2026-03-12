import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAuthStatus } from '../../api/auth'
import useAuthStore from '../../store/authStore'

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore()
  const [checking, setChecking] = useState(true)
  const [needsSetup, setNeedsSetup] = useState(false)

  useEffect(() => {
    getAuthStatus()
      .then(data => { if (data.status === 'setup_required') setNeedsSetup(true) })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }
  if (needsSetup) return <Navigate to="/login?setup=true" replace />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

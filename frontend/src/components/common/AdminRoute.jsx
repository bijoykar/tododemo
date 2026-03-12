import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function AdminRoute() {
  const { role } = useAuthStore()
  if (role !== 'ADMIN') return <Navigate to="/weekly" replace />
  return <Outlet />
}

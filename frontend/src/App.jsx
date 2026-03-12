import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminRoute from './components/common/AdminRoute'
import PinLogin from './components/auth/PinLogin'
import RegisterPage from './pages/RegisterPage'
import WeeklyPage from './pages/WeeklyPage'
import KanbanPage from './pages/KanbanPage'
import AdminPage from './pages/AdminPage'
import Layout from './components/common/Layout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/weekly" replace />} />
        <Route path="/login" element={<PinLogin />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/weekly" element={<WeeklyPage />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/common/ProtectedRoute'
import PinLogin from './components/auth/PinLogin'
import WeeklyPage from './pages/WeeklyPage'
import KanbanPage from './pages/KanbanPage'
import Layout from './components/common/Layout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/weekly" replace />} />
        <Route path="/login" element={<PinLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/weekly" element={<WeeklyPage />} />
            <Route path="/kanban" element={<KanbanPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

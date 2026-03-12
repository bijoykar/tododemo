import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { logout } from '../../api/auth'
import useAuthStore from '../../store/authStore'
import useTodosStore from '../../store/todosStore'
import SubjectManager from '../subjects/SubjectManager'

export default function Navbar() {
  const { clearToken, username, role } = useAuthStore()
  const navigate = useNavigate()
  const [showSubjectManager, setShowSubjectManager] = useState(false)
  const todos = useTodosStore(s => s.todos)
  const needsReviewCount = todos.filter(t => t.status === 'NEEDS_REVIEW').length
  const isAdmin = role === 'ADMIN'

  const handleLogout = async () => {
    try { await logout() } catch {}
    clearToken()
    navigate('/login')
  }

  return (
    <>
      <nav className="w-56 bg-slate-900 text-slate-100 flex flex-col h-full shrink-0">
        <div className="px-6 py-5 border-b border-slate-700">
          <h1 className="text-lg font-bold text-white tracking-tight">TodoPlanner</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {username?.charAt(0).toUpperCase()}
            </div>
            <p className="text-xs text-slate-400 truncate">{username}</p>
            {isAdmin && <span className="text-xs bg-indigo-600 text-indigo-200 px-1 py-0.5 rounded font-medium shrink-0">Admin</span>}
          </div>
        </div>

        <div className="flex-1 py-4 space-y-1 px-3">
          <NavLink to="/weekly"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}>
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Weekly View
          </NavLink>

          <NavLink to="/kanban"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}>
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10m0-10a2 2 0 012 2h2a2 2 0 012-2" />
            </svg>
            Kanban
            {needsReviewCount > 0 && (
              <span className="ml-auto bg-amber-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                {needsReviewCount}
              </span>
            )}
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Users
            </NavLink>
          )}
        </div>

        <div className="px-3 py-4 border-t border-slate-700 space-y-1">
          <button onClick={() => setShowSubjectManager(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Subjects
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-900/50 hover:text-red-300 transition-colors">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </nav>
      {showSubjectManager && <SubjectManager onClose={() => setShowSubjectManager(false)} />}
    </>
  )
}

import { useEffect, useState } from 'react'
import { getAllUsers, approveUser, rejectUser, deleteUser } from '../api/admin'
import toast from 'react-hot-toast'
import { format, parseISO } from 'date-fns'

const STATUS_BADGE = {
  PENDING:  'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-600',
}
const ROLE_BADGE = {
  ADMIN: 'bg-indigo-100 text-indigo-700',
  USER:  'bg-slate-100 text-slate-600',
}

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  const load = async () => {
    setLoading(true)
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleApprove = async (id, username) => {
    try {
      await approveUser(id)
      toast.success(`${username} approved`)
      load()
    } catch { toast.error('Failed to approve') }
  }

  const handleReject = async (id, username) => {
    try {
      await rejectUser(id)
      toast.success(`${username} rejected`)
      load()
    } catch { toast.error('Failed to reject') }
  }

  const handleDelete = async (id, username) => {
    if (!confirm(`Delete user @${username}? This cannot be undone.`)) return
    try {
      await deleteUser(id)
      toast.success(`${username} deleted`)
      load()
    } catch { toast.error('Failed to delete') }
  }

  const pending = users.filter(u => u.status === 'PENDING')
  const filtered = filter === 'ALL' ? users : users.filter(u => u.status === filter)

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Admin — User Management</h2>
            <p className="text-sm text-slate-500">{users.length} total users</p>
          </div>
          {pending.length > 0 && (
            <span className="bg-amber-500 text-white text-sm font-bold px-3 py-1.5 rounded-full animate-pulse">
              {pending.length} pending
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {f.charAt(0) + f.slice(1).toLowerCase()}
              <span className="ml-1.5 text-xs opacity-70">
                {f === 'ALL' ? users.length : users.filter(u => u.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm">No users in this category</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(user => (
              <div key={user.id}
                className={`bg-white rounded-2xl border p-4 flex items-center gap-4 transition-colors ${
                  user.status === 'PENDING' ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200'
                }`}>
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                  {user.username.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900">@{user.username}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_BADGE[user.role]}`}>{user.role}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[user.status]}`}>{user.status}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {user.email || 'No email'} · Joined {user.createdAt ? format(parseISO(user.createdAt), 'MMM d, yyyy') : 'Unknown'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {user.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleApprove(user.id, user.username)}
                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors">
                        Approve
                      </button>
                      <button onClick={() => handleReject(user.id, user.username)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors">
                        Reject
                      </button>
                    </>
                  )}
                  {user.status === 'REJECTED' && (
                    <button onClick={() => handleApprove(user.id, user.username)}
                      className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors">
                      Approve
                    </button>
                  )}
                  {user.role !== 'ADMIN' && (
                    <button onClick={() => handleDelete(user.id, user.username)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

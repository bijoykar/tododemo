import { useState, useEffect } from 'react'
import useSubjectsStore from '../../store/subjectsStore'
import toast from 'react-hot-toast'

const PRESET_COLORS = [
  '#EF4444','#F97316','#EAB308','#22C55E','#14B8A6',
  '#3B82F6','#6366F1','#8B5CF6','#EC4899','#64748B',
]

export default function SubjectManager({ onClose }) {
  const { subjects, fetch, create, update, delete: deleteSubject } = useSubjectsStore()
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('#3B82F6')
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#3B82F6')
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => { fetch() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      await create({ name: newName.trim(), color: newColor })
      setNewName('')
      setNewColor('#3B82F6')
      toast.success('Subject created')
    } catch {
      toast.error('Failed to create subject')
    }
  }

  const handleUpdate = async (id) => {
    try {
      await update(id, { name: editName.trim(), color: editColor })
      setEditId(null)
      toast.success('Subject updated')
    } catch {
      toast.error('Failed to update subject')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteSubject(id)
      setConfirmDelete(null)
      toast.success('Subject deleted')
    } catch {
      toast.error('Failed to delete subject')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-slate-900">Manage Subjects</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {subjects.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-6">No subjects yet. Create one below.</p>
          )}
          {subjects.map(sub => (
            <div key={sub.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
              {editId === sub.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    {PRESET_COLORS.map(c => (
                      <button key={c} type="button" onClick={() => setEditColor(c)}
                        className={`w-5 h-5 rounded-full border-2 transition-transform ${editColor === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }} />
                    ))}
                    <div className="ml-auto flex gap-2">
                      <button onClick={() => handleUpdate(sub.id)} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">Save</button>
                      <button onClick={() => setEditId(null)} className="text-slate-400 hover:text-slate-600 text-sm">Cancel</button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                  <span className="flex-1 text-sm font-medium text-slate-700">{sub.name}</span>
                  <button
                    onClick={() => { setEditId(sub.id); setEditName(sub.name); setEditColor(sub.color) }}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setConfirmDelete(sub)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t bg-slate-50 rounded-b-2xl">
          <form onSubmit={handleCreate} className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Add New Subject</p>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Subject name..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 flex-wrap flex-1">
                {PRESET_COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setNewColor(c)}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${newColor === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
              <button type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shrink-0">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-slate-900 mb-2">Delete Subject?</h3>
            <p className="text-slate-600 text-sm mb-4">
              Delete <strong>{confirmDelete.name}</strong>? Todos using this subject will become Uncategorized.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

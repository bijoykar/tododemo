import { useState } from 'react'
import { useForm } from 'react-hook-form'
import useTodosStore from '../../store/todosStore'
import useSubjectsStore from '../../store/subjectsStore'
import toast from 'react-hot-toast'

export default function TodoDrawer({ todo, onClose, defaultDate }) {
  const { create, update, delete: deleteTodo } = useTodosStore()
  const { subjects } = useSubjectsStore()
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isNew = !todo?.id

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      title: todo?.title || '',
      description: todo?.description || '',
      dueDate: todo?.dueDate || defaultDate || '',
      plannedDate: todo?.plannedDate || defaultDate || '',
      priority: todo?.priority || 'MEDIUM',
      status: todo?.status || 'TODO',
      subjectId: todo?.subjectId || '',
      estimatedEffort: todo?.estimatedEffort || '',
    }
  })

  const plannedDate = watch('plannedDate')
  const dueDate = watch('dueDate')
  const priority = watch('priority')
  const hasConflict = plannedDate && dueDate && plannedDate > dueDate

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = {
        ...data,
        subjectId: data.subjectId ? Number(data.subjectId) : null,
        dueDate: data.dueDate || null,
        plannedDate: data.plannedDate || null,
      }
      if (isNew) {
        await create(payload)
        toast.success('Todo created')
      } else {
        await update(todo.id, payload)
        toast.success('Saved')
      }
      onClose()
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await deleteTodo(todo.id)
      toast.success('Todo deleted')
      onClose()
    } catch {
      toast.error('Failed to delete')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
          <h2 className="font-semibold text-slate-900">{isNew ? 'New Todo' : 'Edit Todo'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-5">
            {hasConflict && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-amber-700 text-xs font-medium">Planned date is after due date</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Title *</label>
              <input
                {...register('title', { required: true })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="What needs to be done?"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
                placeholder="Add details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Due Date</label>
                <input
                  type="date"
                  {...register('dueDate')}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Planned Date</label>
                <input
                  type="date"
                  {...register('plannedDate')}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Priority</label>
              <div className="flex gap-2">
                {['HIGH', 'MEDIUM', 'LOW'].map(p => (
                  <label key={p} className="flex-1 cursor-pointer">
                    <input type="radio" {...register('priority')} value={p} className="sr-only" />
                    <div className={`text-center py-2 px-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                      priority === p
                        ? p === 'HIGH'   ? 'border-red-500 bg-red-50 text-red-600'
                        : p === 'MEDIUM' ? 'border-amber-400 bg-amber-50 text-amber-600'
                        : 'border-slate-400 bg-slate-100 text-slate-600'
                        : 'border-slate-200 text-slate-400 hover:border-slate-300'
                    }`}>
                      {p}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Subject</label>
              <select
                {...register('subjectId')}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition"
              >
                <option value="">Uncategorized</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
              <select
                {...register('status')}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="NEEDS_REVIEW">Needs Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Estimated Effort</label>
              <input
                {...register('estimatedEffort')}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="e.g. 30min, 2h"
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-slate-50 flex gap-3">
            {!isNew && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-700 hover:bg-slate-100 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {saving ? 'Saving...' : isNew ? 'Create' : 'Save'}
            </button>
          </div>
        </form>

        {confirmDelete && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center p-6 z-10">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs border">
              <h3 className="font-semibold text-slate-900 mb-2">Delete Todo?</h3>
              <p className="text-slate-500 text-sm mb-4">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(false)} className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-xl text-sm hover:bg-slate-50">Cancel</button>
                <button onClick={handleDelete} disabled={saving} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-medium disabled:opacity-60">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { format } from 'date-fns'
import useTodosStore from '../../store/todosStore'
import toast from 'react-hot-toast'

export default function QuickAddBar({ date, onCreated }) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const { create } = useTodosStore()

  const handleKeyDown = async (e) => {
    if (e.key !== 'Enter' || !value.trim()) return
    const dateStr = format(date, 'yyyy-MM-dd')
    setLoading(true)
    try {
      const todo = await create({
        title: value.trim(),
        dueDate: dateStr,
        plannedDate: dateStr,
        priority: 'MEDIUM',
        status: 'TODO',
      })
      setValue('')
      onCreated(todo)
    } catch {
      toast.error('Failed to create todo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <input
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={loading}
      placeholder="+ Add todo..."
      className="w-full text-xs bg-slate-50 hover:bg-white focus:bg-white border border-dashed border-slate-300 hover:border-indigo-400 focus:border-indigo-400 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
    />
  )
}

import { useEffect, useState } from 'react'
import {
  DndContext, DragOverlay, PointerSensor, TouchSensor,
  useSensor, useSensors, closestCenter
} from '@dnd-kit/core'
import useTodosStore from '../store/todosStore'
import useSubjectsStore from '../store/subjectsStore'
import KanbanColumn from '../components/kanban/KanbanColumn'
import KanbanCard from '../components/kanban/KanbanCard'
import TodoDrawer from '../components/todos/TodoDrawer'
import toast from 'react-hot-toast'

const STATUSES = ['TODO', 'IN_PROGRESS', 'NEEDS_REVIEW', 'DONE']
const STATUS_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  NEEDS_REVIEW: 'Needs Review',
  DONE: 'Done',
}

export default function KanbanPage() {
  const { todos, fetch, loading, updateStatus } = useTodosStore()
  const { fetch: fetchSubjects } = useSubjectsStore()
  const [drawerTodo, setDrawerTodo] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('TODO')
  const [activeDragTodo, setActiveDragTodo] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  useEffect(() => {
    fetch()
    fetchSubjects()
  }, [])

  useEffect(() => {
    const needsReview = todos.filter(t => t.status === 'NEEDS_REVIEW')
    if (needsReview.length > 0) {
      toast(`${needsReview.length} todo${needsReview.length > 1 ? 's' : ''} need${needsReview.length === 1 ? 's' : ''} review`, { icon: '⚠️' })
    }
  }, [todos.filter(t => t.status === 'NEEDS_REVIEW').length])

  const getTodosByStatus = (status) => todos.filter(t => t.status === status)

  const handleDragStart = ({ active }) => {
    setActiveDragTodo(todos.find(t => t.id === active.id))
  }

  const handleDragEnd = async ({ active, over }) => {
    setActiveDragTodo(null)
    if (!over) return
    const newStatus = STATUSES.includes(over.id) ? over.id : null
    if (!newStatus) return
    const todo = todos.find(t => t.id === active.id)
    if (!todo || todo.status === newStatus) return

    if (todo.status === 'NEEDS_REVIEW' && newStatus === 'TODO') {
      setDrawerTodo(todo)
      setDrawerOpen(true)
    }
    await updateStatus(active.id, newStatus)
  }

  const openDrawer = (todo) => {
    setDrawerTodo(todo)
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setDrawerTodo(null)
    fetch()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Kanban Board</h2>
            <p className="text-sm text-slate-500">{todos.length} total tasks</p>
          </div>
          {loading && (
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin ml-auto" />
          )}
        </div>
      </div>

      {/* Desktop: 4 columns */}
      <div className="hidden md:flex flex-1 overflow-auto p-5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-4 gap-4 w-full" style={{ minHeight: '600px' }}>
            {STATUSES.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                todos={getTodosByStatus(status)}
                onCardClick={openDrawer}
              />
            ))}
          </div>
          <DragOverlay>
            {activeDragTodo && (
              <div className="bg-white rounded-xl border border-indigo-300 p-3 shadow-2xl rotate-1 w-52 opacity-90">
                <p className="text-sm font-medium text-slate-800 truncate">{activeDragTodo.title}</p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Mobile: tab list */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden">
        <div className="flex border-b border-slate-200 bg-white overflow-x-auto shrink-0">
          {STATUSES.map(status => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === status
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {STATUS_LABELS[status]}
              <span className="ml-1.5 text-xs bg-slate-100 text-slate-600 rounded-full px-1.5 py-0.5">
                {getTodosByStatus(status).length}
              </span>
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {getTodosByStatus(activeTab).map(todo => (
            <KanbanCard key={todo.id} todo={todo} onClick={openDrawer} />
          ))}
          {getTodosByStatus(activeTab).length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">No tasks here</p>
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <TodoDrawer todo={drawerTodo} onClose={closeDrawer} />
      )}
    </div>
  )
}

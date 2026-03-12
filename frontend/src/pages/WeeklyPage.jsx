import { useEffect, useState } from 'react'
import {
  DndContext, DragOverlay, PointerSensor, TouchSensor,
  useSensor, useSensors, closestCenter
} from '@dnd-kit/core'
import { format } from 'date-fns'
import useWeek from '../hooks/useWeek'
import useTodosStore from '../store/todosStore'
import useSubjectsStore from '../store/subjectsStore'
import DayCell from '../components/weekly/DayCell'
import TodoDrawer from '../components/todos/TodoDrawer'
import PriorityBadge from '../components/common/PriorityBadge'

export default function WeeklyPage() {
  const { weekDays, goToPrevWeek, goToNextWeek, goToToday, currentWeekStart } = useWeek()
  const { todos, fetch, loading, updatePlannedDate } = useTodosStore()
  const { fetch: fetchSubjects } = useSubjectsStore()
  const [drawerTodo, setDrawerTodo] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerDefaultDate, setDrawerDefaultDate] = useState(null)
  const [activeDragTodo, setActiveDragTodo] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  useEffect(() => {
    const from = format(weekDays[0], 'yyyy-MM-dd')
    const to = format(weekDays[6], 'yyyy-MM-dd')
    fetch({ from, to })
    fetchSubjects()
  }, [currentWeekStart])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowLeft') goToPrevWeek()
      if (e.key === 'ArrowRight') goToNextWeek()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goToPrevWeek, goToNextWeek])

  const getTodosForDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return todos.filter(t => (t.plannedDate || t.dueDate) === dateStr)
  }

  const handleDragStart = ({ active }) => {
    setActiveDragTodo(todos.find(t => t.id === active.id))
  }

  const handleDragEnd = async ({ active, over }) => {
    setActiveDragTodo(null)
    if (!over) return
    const newDate = over.id
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) return
    const todo = todos.find(t => t.id === active.id)
    if (!todo || (todo.plannedDate || todo.dueDate) === newDate) return
    await updatePlannedDate(active.id, newDate)
  }

  const refetchWeek = () => {
    const from = format(weekDays[0], 'yyyy-MM-dd')
    const to = format(weekDays[6], 'yyyy-MM-dd')
    fetch({ from, to })
  }

  const openDrawer = (todo) => {
    setDrawerTodo(todo)
    setDrawerDefaultDate(null)
    setDrawerOpen(true)
  }

  const openNewDrawer = (todo, date) => {
    setDrawerTodo(todo)
    setDrawerDefaultDate(format(date, 'yyyy-MM-dd'))
    setDrawerOpen(true)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Weekly View</h2>
          <p className="text-sm text-slate-500">
            {format(weekDays[0], 'MMM d')} — {format(weekDays[6], 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {loading && (
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          )}
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={goToPrevWeek} className="px-3 py-1.5 hover:bg-slate-50 transition-colors border-r border-slate-200">
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={goToNextWeek} className="px-3 py-1.5 hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-auto p-4">
          {/* Desktop: 7 columns */}
          <div className="hidden md:grid md:grid-cols-7 gap-3 h-full" style={{ minHeight: '600px' }}>
            {weekDays.map(day => (
              <DayCell
                key={format(day, 'yyyy-MM-dd')}
                date={day}
                todos={getTodosForDay(day)}
                onCardClick={openDrawer}
                onTodoCreated={(todo) => openNewDrawer(todo, day)}
              />
            ))}
          </div>

          {/* Mobile: horizontal scroll snap */}
          <div className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 -mx-1 px-1">
            {weekDays.map(day => (
              <div
                key={format(day, 'yyyy-MM-dd')}
                className="shrink-0 snap-center"
                style={{ width: '85vw' }}
              >
                <DayCell
                  date={day}
                  todos={getTodosForDay(day)}
                  onCardClick={openDrawer}
                  onTodoCreated={(todo) => openNewDrawer(todo, day)}
                />
              </div>
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeDragTodo && (
            <div className="bg-white rounded-xl border border-indigo-300 p-3 shadow-2xl rotate-2 w-44 opacity-90">
              <div className="flex items-center gap-2">
                <PriorityBadge priority={activeDragTodo.priority} />
                <p className="text-sm font-medium text-slate-800 truncate">{activeDragTodo.title}</p>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {drawerOpen && (
        <TodoDrawer
          todo={drawerTodo?.id ? drawerTodo : null}
          defaultDate={drawerDefaultDate}
          onClose={() => {
            setDrawerOpen(false)
            setDrawerTodo(null)
            refetchWeek()
          }}
        />
      )}
    </div>
  )
}

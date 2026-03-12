import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { format, isToday } from 'date-fns'
import TodoCard from './TodoCard'
import QuickAddBar from './QuickAddBar'

export default function DayCell({ date, todos, onCardClick, onTodoCreated }) {
  const dateStr = format(date, 'yyyy-MM-dd')
  const isCurrentDay = isToday(date)

  const { setNodeRef, isOver } = useDroppable({ id: dateStr })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl border-2 transition-colors min-h-0 ${
        isOver ? 'border-indigo-400 bg-indigo-50/30' : 'border-transparent'
      }`}
    >
      <div className={`px-3 py-2.5 rounded-t-xl ${isCurrentDay ? 'bg-indigo-600' : 'bg-slate-100'}`}>
        <p className={`text-xs font-semibold uppercase tracking-wide ${isCurrentDay ? 'text-indigo-200' : 'text-slate-500'}`}>
          {format(date, 'EEE')}
        </p>
        <p className={`text-xl font-bold leading-none mt-0.5 ${isCurrentDay ? 'text-white' : 'text-slate-800'}`}>
          {format(date, 'd')}
        </p>
        <p className={`text-xs mt-0.5 ${isCurrentDay ? 'text-indigo-200' : 'text-slate-400'}`}>
          {todos.length > 0 ? `${todos.length} task${todos.length !== 1 ? 's' : ''}` : '\u00A0'}
        </p>
      </div>

      <div className="flex-1 px-2 py-2 space-y-1.5 overflow-y-auto min-h-[180px]">
        <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {todos.map(todo => (
            <TodoCard key={todo.id} todo={todo} onClick={onCardClick} />
          ))}
        </SortableContext>
        {todos.length === 0 && (
          <div className="flex items-center justify-center h-16 text-xs text-slate-300 select-none">
            Drop here
          </div>
        )}
      </div>

      <div className="px-2 pb-2">
        <QuickAddBar date={date} onCreated={onTodoCreated} />
      </div>
    </div>
  )
}

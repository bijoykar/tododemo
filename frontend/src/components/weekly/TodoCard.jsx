import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format, parseISO } from 'date-fns'
import PriorityBadge from '../common/PriorityBadge'
import SubjectChip from '../common/SubjectChip'

export default function TodoCard({ todo, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const hasConflict = todo.plannedDate && todo.dueDate && todo.plannedDate > todo.dueDate
  const showDueDate = todo.dueDate && todo.dueDate !== todo.plannedDate

  const statusBorder = {
    TODO: 'border-l-slate-300',
    IN_PROGRESS: 'border-l-blue-400',
    NEEDS_REVIEW: 'border-l-amber-400',
    DONE: 'border-l-green-400',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(todo)}
      className={`bg-white rounded-xl border border-slate-200 border-l-4 ${statusBorder[todo.status] || 'border-l-slate-300'} p-3 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all select-none ${todo.status === 'DONE' ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-2">
        <PriorityBadge priority={todo.priority} />
        <p className="flex-1 text-sm font-medium text-slate-800 leading-snug line-clamp-2 min-w-0">
          {todo.title}
        </p>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {todo.subjectName && <SubjectChip name={todo.subjectName} color={todo.subjectColor} />}
        {showDueDate && (
          <span className="text-xs text-slate-400">
            due {format(parseISO(todo.dueDate), 'MMM d')}
          </span>
        )}
        {hasConflict && (
          <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md font-medium">
            ⚠ Late plan
          </span>
        )}
      </div>
    </div>
  )
}

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format, parseISO, isPast } from 'date-fns'
import PriorityBadge from '../common/PriorityBadge'
import SubjectChip from '../common/SubjectChip'

export default function KanbanCard({ todo, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const isOverdue = todo.dueDate && todo.status !== 'DONE' &&
    isPast(parseISO(todo.dueDate + 'T23:59:59'))

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(todo)}
      className="bg-white rounded-xl border border-slate-200 p-3 cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all select-none"
    >
      <div className="flex items-start gap-2 mb-2">
        <PriorityBadge priority={todo.priority} />
        <p className="flex-1 text-sm font-medium text-slate-800 leading-snug line-clamp-2">{todo.title}</p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {todo.subjectName && <SubjectChip name={todo.subjectName} color={todo.subjectColor} />}
        {todo.dueDate && (
          <span className={`text-xs px-1.5 py-0.5 rounded-md ${
            isOverdue ? 'bg-red-50 text-red-600 font-medium' : 'text-slate-400 bg-slate-50'
          }`}>
            {isOverdue ? '⚠ ' : ''}{format(parseISO(todo.dueDate), 'MMM d')}
          </span>
        )}
        {todo.estimatedEffort && (
          <span className="text-xs text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md">
            {todo.estimatedEffort}
          </span>
        )}
      </div>
    </div>
  )
}

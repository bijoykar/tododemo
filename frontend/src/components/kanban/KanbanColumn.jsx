import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import KanbanCard from './KanbanCard'

const COLUMN_CONFIG = {
  TODO:         { label: 'To Do',        color: 'bg-slate-100 text-slate-600',  dot: 'bg-slate-400'  },
  IN_PROGRESS:  { label: 'In Progress',  color: 'bg-blue-50 text-blue-700',     dot: 'bg-blue-400'   },
  NEEDS_REVIEW: { label: 'Needs Review', color: 'bg-amber-50 text-amber-700',   dot: 'bg-amber-400'  },
  DONE:         { label: 'Done',         color: 'bg-green-50 text-green-700',   dot: 'bg-green-400'  },
}

export default function KanbanColumn({ status, todos, onCardClick }) {
  const config = COLUMN_CONFIG[status]
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col min-w-0">
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3 ${config.color}`}>
        <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
        <span className="text-sm font-semibold">{config.label}</span>
        <span className="ml-auto text-xs font-bold opacity-60 bg-white/50 rounded-full px-1.5 py-0.5">
          {todos.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 rounded-2xl p-2 space-y-2 min-h-[200px] transition-colors ${
          isOver
            ? 'bg-indigo-50 border-2 border-dashed border-indigo-300'
            : 'bg-slate-50/50 border-2 border-transparent'
        }`}
      >
        <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {todos.map(todo => (
            <KanbanCard key={todo.id} todo={todo} onClick={onCardClick} />
          ))}
        </SortableContext>
        {todos.length === 0 && (
          <div className="flex items-center justify-center h-16 text-xs text-slate-300 select-none">
            Drop here
          </div>
        )}
      </div>
    </div>
  )
}

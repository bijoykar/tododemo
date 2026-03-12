const config = {
  HIGH:   { dot: 'bg-red-500',   text: 'text-red-600',   label: 'High', bg: 'bg-red-50'   },
  MEDIUM: { dot: 'bg-amber-400', text: 'text-amber-600', label: 'Med',  bg: 'bg-amber-50' },
  LOW:    { dot: 'bg-slate-400', text: 'text-slate-500', label: 'Low',  bg: 'bg-slate-100'},
}

export default function PriorityBadge({ priority, showLabel = false }) {
  const c = config[priority] || config.MEDIUM
  if (showLabel) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {c.label}
      </span>
    )
  }
  return <span className={`w-2 h-2 rounded-full inline-block shrink-0 mt-0.5 ${c.dot}`} title={c.label} />
}

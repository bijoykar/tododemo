export default function SubjectChip({ name, color }) {
  if (!name) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500">
        Uncategorized
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: color || '#6B7280' }}
    >
      {name}
    </span>
  )
}

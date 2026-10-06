const sortOptions = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'year-desc', label: 'Newest First' },
  { value: 'year-asc', label: 'Oldest First' },
  { value: 'title', label: 'A – Z' },
]

export default function SortDropdown({ value, onChange }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="sr-only">Sort by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-3 py-2 pr-8 cursor-pointer hover:bg-white/10 transition-colors focus:outline-none focus:border-violet-500"
        aria-label="Sort content"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'rgba(255,255,255,0.4)\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-neutral-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}

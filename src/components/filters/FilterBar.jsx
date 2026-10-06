import FilterDropdown from './FilterDropdown'
import SortDropdown from './SortDropdown'

export default function FilterBar({ filters, onFilterChange, sort, onSortChange, genreOptions = [], yearOptions = [] }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterDropdown
        label="Genre"
        value={filters.genre || ''}
        options={[{ value: '', label: 'All Genres' }, ...genreOptions.map((g) => ({ value: g, label: g }))]}
        onChange={(v) => onFilterChange({ ...filters, genre: v })}
      />
      <FilterDropdown
        label="Year"
        value={filters.year || ''}
        options={[{ value: '', label: 'All Years' }, ...yearOptions.map((y) => ({ value: String(y), label: String(y) }))]}
        onChange={(v) => onFilterChange({ ...filters, year: v })}
      />
      <FilterDropdown
        label="Min Rating"
        value={filters.minRating || ''}
        options={[
          { value: '', label: 'Any Rating' },
          { value: '9', label: '9+' },
          { value: '8', label: '8+' },
          { value: '7', label: '7+' },
        ]}
        onChange={(v) => onFilterChange({ ...filters, minRating: v })}
      />
      <SortDropdown value={sort} onChange={onSortChange} />

      {/* Clear filters */}
      {(filters.genre || filters.year || filters.minRating) && (
        <button
          onClick={() => onFilterChange({})}
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors cursor-pointer px-3 py-2 rounded-lg border border-violet-500/30 hover:border-violet-400/50"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

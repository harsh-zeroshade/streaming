import { useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Search titles, genres, cast…', autoFocus = false }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSubmit?.(value)
  }

  return (
    <div className="relative w-full">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-white/8 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500 transition-colors text-base"
        aria-label="Search content"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}

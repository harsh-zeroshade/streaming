export default function SeasonSelector({ seasons, activeSeason, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Select season">
      {Array.from({ length: seasons }, (_, i) => i + 1).map((s) => (
        <button
          key={s}
          role="tab"
          aria-selected={activeSeason === s}
          onClick={() => onChange(s)}
          className={[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer',
            activeSeason === s
              ? 'bg-violet-600 text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10',
          ].join(' ')}
        >
          Season {s}
        </button>
      ))}
    </div>
  )
}

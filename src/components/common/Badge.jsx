/**
 * Small inline badge for genres, ratings, maturity labels, etc.
 */
const variants = {
  default: 'bg-white/10 text-white/70',
  genre: 'bg-white/10 text-white/80 hover:bg-white/20 cursor-pointer transition-colors',
  maturity: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  rating: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
  new: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  featured: 'bg-violet-600 text-white',
}

export default function Badge({ children, variant = 'default', className = '', onClick }) {
  return (
    <span
      onClick={onClick}
      className={[
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        variants[variant] || variants.default,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
